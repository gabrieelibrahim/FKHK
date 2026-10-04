const prisma = require('../lib/prisma');
const mailer = require('../utils/mailer');

exports.getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        dateTime: true,
        location: true,
        onlineUrl: true,
        capacity: true,
        status: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        createdBy: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
      },
    });

    const total = await prisma.event.count({ where });

    res.json({
      data: events,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventBySlug = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: req.params.slug },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if current user is registered
    let isRegistered = false;
    if (req.member) {
      const reg = await prisma.registration.findFirst({
        where: {
          eventId: event.id,
          memberId: req.member.id,
        },
      });
      isRegistered = !!reg;
    }

    res.json({ ...event, isRegistered });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, dateTime, location, onlineUrl, capacity, imageUrl, category } = req.body;
    if (!title || !description || !dateTime) {
      return res.status(400).json({ message: 'Title, description, and dateTime are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        dateTime: new Date(dateTime),
        location: location || null,
        onlineUrl: onlineUrl || null,
        imageUrl: imageUrl || null,
        capacity: capacity ? parseInt(capacity) : null,
        category: category === 'internal' ? 'internal' : 'umum',
        createdById: req.member.id,
        status: 'upcoming',
      },
    });

    res.status(201).json(event);

    // notify subscribers (non-blocking)
    prisma.newsletterSubscriber.findMany({ where: { unsubscribedAt: null } })
      .then((subs) => mailer.sendNewEventNotification(subs, event))
      .catch(() => {});
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, dateTime, location, onlineUrl, capacity, status, imageUrl, category } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (dateTime !== undefined) data.dateTime = new Date(dateTime);
    if (location !== undefined) data.location = location || null;
    if (onlineUrl !== undefined) data.onlineUrl = onlineUrl || null;
    if (capacity !== undefined) data.capacity = capacity ? parseInt(capacity) : null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
    if (status !== undefined) data.status = status;
    if (category !== undefined) data.category = category === 'internal' ? 'internal' : 'umum';

    const updated = await prisma.event.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    if (event.category === 'internal') {
      return res.status(400).json({ message: 'Kegiatan ini bersifat internal dan tidak membuka pendaftaran umum.' });
    }
    if (event.status !== 'upcoming') {
      return res.status(400).json({ message: 'Pendaftaran kegiatan ini sudah ditutup' });
    }
    if (event.capacity && event._count.registrations >= event.capacity) {
      return res.status(400).json({ message: 'Kapasitas kegiatan sudah penuh' });
    }

    // 1. If logged-in member
    if (req.member) {
      const existing = await prisma.registration.findFirst({
        where: { eventId: event.id, memberId: req.member.id },
      });
      if (existing) return res.status(409).json({ message: 'Anda sudah terdaftar pada kegiatan ini' });

      const registration = await prisma.registration.create({
        data: {
          eventId: event.id,
          memberId: req.member.id,
          name: req.member.name,
          email: req.member.email,
        },
      });
      return res.status(201).json({ message: 'Pendaftaran berhasil!', registration });
    }

    // 2. If public user without login
    const { name, email, phone, institution, nim } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Nama lengkap dan email wajib diisi' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.registration.findFirst({
      where: {
        eventId: event.id,
        email: cleanEmail,
      },
    });
    if (existing) {
      return res.status(409).json({ message: 'Email ini sudah terdaftar pada kegiatan ini' });
    }

    const registration = await prisma.registration.create({
      data: {
        eventId: event.id,
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        institution: institution ? institution.trim() : null,
        nim: nim ? nim.trim() : null,
      },
    });

    res.status(201).json({ message: 'Pendaftaran berhasil!', registration });
  } catch (err) {
    next(err);
  }
};

exports.unregisterFromEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.registration.deleteMany({
      where: { eventId: parseInt(id), memberId: req.member.id },
    });
    res.json({ message: 'Unregistered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getRegistrations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const registrations = await prisma.registration.findMany({
      where: { eventId: parseInt(id) },
      include: { member: { select: { id: true, name: true, email: true, affiliation: true, phone: true } } },
      orderBy: { registeredAt: 'asc' },
    });

    const data = registrations.map((r) => ({
      id: r.id,
      name: r.name || r.member?.name || '-',
      email: r.email || r.member?.email || '-',
      phone: r.phone || r.member?.phone || '-',
      institution: r.institution || r.member?.affiliation || '-',
      nim: r.nim || '-',
      registeredAt: r.registeredAt,
      attended: r.attended,
      isMember: !!r.memberId,
    }));

    res.json({ data, total: data.length });
  } catch (err) {
    next(err);
  }
};
