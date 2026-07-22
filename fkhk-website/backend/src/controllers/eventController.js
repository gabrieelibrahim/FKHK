const prisma = require('../lib/prisma');

exports.getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (status) where.status = status;

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
      const reg = await prisma.registration.findUnique({
        where: {
          eventId_memberId: { eventId: event.id, memberId: req.member.id },
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
    const { title, description, dateTime, location, onlineUrl, capacity, imageUrl } = req.body;
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
        location,
        onlineUrl,
        imageUrl,
        capacity: capacity ? parseInt(capacity) : null,
        createdById: req.member.id,
        status: 'upcoming',
      },
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.event.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Event not found' });

    const { title, description, dateTime, location, onlineUrl, capacity, status, imageUrl } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (dateTime !== undefined) data.dateTime = new Date(dateTime);
    if (location !== undefined) data.location = location;
    if (onlineUrl !== undefined) data.onlineUrl = onlineUrl;
    if (capacity !== undefined) data.capacity = parseInt(capacity);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (status !== undefined) data.status = status;

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

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'upcoming') return res.status(400).json({ message: 'Event is not open for registration' });
    if (event.capacity && event._count.registrations >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const existing = await prisma.registration.findUnique({
      where: { eventId_memberId: { eventId: event.id, memberId: req.member.id } },
    });
    if (existing) return res.status(409).json({ message: 'Already registered' });

    const registration = await prisma.registration.create({
      data: { eventId: event.id, memberId: req.member.id },
    });

    res.status(201).json({ message: 'Registered successfully', registration });
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
      include: { member: { select: { id: true, name: true, email: true, affiliation: true } } },
      orderBy: { registeredAt: 'asc' },
    });
    res.json({ data: registrations, total: registrations.length });
  } catch (err) {
    next(err);
  }
};
