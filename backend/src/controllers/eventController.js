const prisma = require('../lib/prisma');
const mailer = require('../utils/mailer');

// Batas waktu kegiatan masih "berlangsung" setelah jadwal (detik).
// Sama dengan window presensi (3 jam setelah mulai) supaya konsisten.
const EVENT_END_OFFSET_MS = 3 * 60 * 60 * 1000;

// Status efektif kegiatan: upcoming yang sudah lewat 3 jam otomatis dianggap completed.
// cancelled tidak pernah di-override.
function effectiveStatus(event, now = Date.now()) {
  if (event.status === 'cancelled') return 'cancelled';
  if (event.status === 'upcoming' && event.dateTime && (now - new Date(event.dateTime).getTime()) > EVENT_END_OFFSET_MS) {
    return 'completed';
  }
  return event.status;
}

// Sinkronisasi status di DB (best-effort, tidak boleh menggagalkan request).
async function syncExpiredEvents() {
  try {
    const cutoff = new Date(Date.now() - EVENT_END_OFFSET_MS);
    const res = await prisma.event.updateMany({
      where: { status: 'upcoming', dateTime: { lt: cutoff } },
      data: { status: 'completed' },
    });
    return res.count;
  } catch (err) {
    return 0;
  }
}

exports.getEvents = async (req, res, next) => {
  try {
    // Biar status di DB selalu segar: upcoming yang udah lewat auto jadi completed
    await syncExpiredEvents();

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

    const isAdmin = req.member && ['superadmin', 'admin_kaset', 'admin_psdm', 'admin_bph', 'admin'].includes(req.member.role);

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
        presensiCode: isAdmin ? true : false,
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
    // Pastikan kegiatan yang sudah lewat tidak tampil "Akan Datang"
    await syncExpiredEvents();

    const event = await prisma.event.findUnique({
      where: { slug: req.params.slug },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Jangan bocorkan kode presensi ke publik
    const { presensiCode, ...safeEvent } = event;

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

    res.json({ ...safeEvent, status: effectiveStatus(event), isRegistered });
  } catch (err) {
    next(err);
  }
};

// Parse dateTime dari admin (datetime-local, tanpa zona waktu) sebagai WIB (UTC+7).
// String yang sudah punya zona waktu (Z / +07:00) dipakai apa adanya.
function parseWibDateTime(value) {
  if (value instanceof Date) return value;
  const s = String(value).trim();
  if (/[zZ]$/.test(s) || /([+-]\d{2}:?\d{2})$/.test(s)) {
    return new Date(s);
  }
  const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?)?$/);
  if (m) {
    return new Date(`${m[1]}T${m[2] || "00:00:00"}+07:00`);
  }
  return new Date(s);
}

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, dateTime, location, onlineUrl, capacity, imageUrl, category, presensiCode } = req.body;
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
        dateTime: parseWibDateTime(dateTime),
        location: location || null,
        onlineUrl: onlineUrl || null,
        imageUrl: imageUrl || null,
        capacity: capacity ? parseInt(capacity) : null,
        category: category === 'internal' ? 'internal' : 'umum',
        presensiCode: presensiCode ? presensiCode.trim().toUpperCase() : null,
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

    const { title, description, dateTime, location, onlineUrl, capacity, status, imageUrl, category, presensiCode } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (dateTime !== undefined) data.dateTime = parseWibDateTime(dateTime);
    if (location !== undefined) data.location = location || null;
    if (onlineUrl !== undefined) data.onlineUrl = onlineUrl || null;
    if (capacity !== undefined) data.capacity = capacity ? parseInt(capacity) : null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
    if (status !== undefined) data.status = status;
    if (category !== undefined) data.category = category === 'internal' ? 'internal' : 'umum';
    if (presensiCode !== undefined) data.presensiCode = presensiCode ? presensiCode.trim().toUpperCase() : null;

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


exports.getActiveEventsForPresensi = async (req, res, next) => {
  try {
    // Hanya event hari ini (zona WIB) — presensi hanya dibuka hari-H
    const wibOffsetMs = 7 * 60 * 60 * 1000;
    const nowWib = new Date(Date.now() + wibOffsetMs);
    const todayWibStr = nowWib.toISOString().slice(0, 10);
    const startOfDayUtc = new Date(todayWibStr + "T00:00:00.000Z").getTime() - wibOffsetMs;
    const endOfDayUtc = startOfDayUtc + 24 * 60 * 60 * 1000;

    const events = await prisma.event.findMany({
      where: {
        status: { in: ["upcoming", "ongoing"] },
        dateTime: {
          gte: new Date(startOfDayUtc),
          lt: new Date(endOfDayUtc),
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        dateTime: true,
        location: true,
        status: true,
        presensiCode: true,
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { dateTime: "asc" },
      take: 10
    });

    // Flag butuh-kode tanpa membocorkan kodenya ke publik
    const eventsWithFlag = events.map((ev) => {
      const hasCode = Boolean(ev.presensiCode);
      const { presensiCode, ...safeEvent } = ev;
      return { ...safeEvent, requiresCode: hasCode };
    });

    res.json({ success: true, data: eventsWithFlag });
  } catch (err) {
    next(err);
  }
};

// POST /api/events/presensi/record — WAJIB LOGIN (khusus anggota FKHK)
exports.recordPresensi = async (req, res, next) => {
  try {
    if (!req.member) {
      return res.status(401).json({
        success: false,
        message: "Presensi khusus anggota FKHK. Silakan login terlebih dahulu."
      });
    }

    const member = await prisma.member.findUnique({
      where: { id: req.member.id },
      select: { id: true, name: true, nim: true, email: true, affiliation: true }
    });
    if (!member) {
      return res.status(401).json({ success: false, message: "Akun tidak ditemukan." });
    }

    const { eventId, code } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Kegiatan wajib dipilih"
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan" });
    }

    // === Anti-manipulasi 1: jendela waktu presensi (hari-H saja, WIB) ===
    const now = new Date();
    const eventDate = new Date(event.dateTime);
    // hari & jam kegiatan dalam zona WIB (UTC+7)
    const wibOffsetMs = 7 * 60 * 60 * 1000;
    const nowWib = new Date(now.getTime() + wibOffsetMs);
    const eventWib = new Date(eventDate.getTime() + wibOffsetMs);
    const nowWibDay = nowWib.toISOString().slice(0, 10);
    const eventWibDay = eventWib.toISOString().slice(0, 10);
    if (nowWibDay !== eventWibDay) {
      return res.status(400).json({
        success: false,
        message: "Presensi hanya bisa diisi pada hari kegiatan berlangsung."
      });
    }

    // === Jendela jam presensi: dibuka 15 menit sebelum mulai, ditutup 3 jam setelah mulai ===
    const PRESENSI_OPEN_BEFORE_MS = 15 * 60 * 1000;
    const PRESENSI_CLOSE_AFTER_MS = 3 * 60 * 60 * 1000;
    const openAtMs = eventWib.getTime() - PRESENSI_OPEN_BEFORE_MS;
    const closeAtMs = eventWib.getTime() + PRESENSI_CLOSE_AFTER_MS;
    if (nowWib.getTime() < openAtMs) {
      const jamMulai = eventWib.toISOString().slice(11, 16);
      return res.status(400).json({
        success: false,
        message: `Presensi belum dibuka. Kegiatan dimulai pukul ${jamMulai} WIB — presensi dibuka 15 menit sebelum mulai.`
      });
    }
    if (nowWib.getTime() > closeAtMs) {
      return res.status(400).json({
        success: false,
        message: "Sesi presensi sudah ditutup (3 jam setelah jadwal mulai kegiatan)."
      });
    }

    // === Anti-manipulasi 2: kode presensi dari panitia (anti titip absen) ===
    if (event.presensiCode) {
      const submittedCode = (code || "").trim().toUpperCase();
      if (!submittedCode) {
        return res.status(400).json({
          success: false,
          message: "Kode presensi wajib diisi. Minta kode kepada panitia di lokasi kegiatan."
        });
      }
      if (submittedCode !== event.presensiCode) {
        return res.status(403).json({
          success: false,
          message: "Kode presensi salah. Minta kode yang sah kepada panitia."
        });
      }
    }

    // === Anti-manipulasi 3: jejak audit IP ===
    const clientIp =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket.remoteAddress ||
      null;

    // Identitas diambil dari akun yang login — bukan dari input form (anti titip absen)
    const resolvedName = member.name;
    const resolvedEmail = member.email;
    const resolvedNim = member.nim;

    // Cari registration yang sudah ada untuk member ini di event ini
    let registration = await prisma.registration.findFirst({
      where: { eventId: event.id, memberId: member.id }
    });
    if (!registration && resolvedNim) {
      registration = await prisma.registration.findFirst({
        where: { eventId: event.id, nim: resolvedNim }
      });
    }
    if (!registration) {
      registration = await prisma.registration.findFirst({
        where: { eventId: event.id, email: resolvedEmail.toLowerCase() }
      });
    }

    if (registration) {
      if (registration.attended) {
        return res.status(200).json({
          success: true,
          alreadyAttended: true,
          message: "Presensi sudah tercatat sebelumnya.",
          data: {
            name: registration.name || resolvedName,
            nim: registration.nim || resolvedNim,
            institution: registration.institution || (member.affiliation || "FKHK"),
            eventTitle: event.title,
            attended: true,
            registeredAt: registration.registeredAt
          }
        });
      }

      const updated = await prisma.registration.update({
        where: { id: registration.id },
        data: {
          attended: true,
          presensiIp: clientIp,
          memberId: registration.memberId || member.id
        }
      });

      return res.status(200).json({
        success: true,
        message: "Presensi berhasil dicatat!",
        data: {
          name: updated.name || resolvedName,
          nim: updated.nim || resolvedNim,
          institution: updated.institution || (member.affiliation || "FKHK"),
          eventTitle: event.title,
          attended: true,
          registeredAt: updated.registeredAt
        }
      });
    }

    const newReg = await prisma.registration.create({
      data: {
        eventId: event.id,
        memberId: member.id,
        name: resolvedName,
        email: resolvedEmail,
        nim: resolvedNim,
        institution: member.affiliation || (event.category === "internal" ? "Internal FKHK" : "FKHK"),
        attended: true,
        presensiIp: clientIp
      }
    });

    return res.status(201).json({
      success: true,
      message: "Presensi kehadiran baru berhasil dicatat!",
      data: {
        name: newReg.name,
        nim: newReg.nim,
        institution: newReg.institution,
        eventTitle: event.title,
        attended: true,
        registeredAt: newReg.registeredAt
      }
    });
  } catch (err) {
    next(err);
  }
};
