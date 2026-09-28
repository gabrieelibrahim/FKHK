const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

exports.createMember = async (req, res, next) => {
  try {
    const { email, password, name, affiliation, phone, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
    const passwordHash = await bcrypt.hash(password, salt);

    const member = await prisma.member.create({
      data: {
        email,
        passwordHash,
        name,
        affiliation: affiliation || null,
        phone: phone || null,
        role: role || 'member',
      },
      select: {
        id: true,
        email: true,
        name: true,
        affiliation: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({ message: 'Member created successfully', member });
  } catch (err) {
    next(err);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const members = await prisma.member.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        email: true,
        affiliation: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    const totalMembers = await prisma.member.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    res.status(200).json({
      data: members,
      total: totalMembers,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalMembers / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        affiliation: true,
        bio: true,
        avatarUrl: true,
        interests: true,
        role: true,
        createdAt: true,
        articles: {
          select: { id: true, title: true, slug: true, status: true, publishedAt: true },
          where: { status: 'published' },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
};

exports.updateMemberByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, affiliation, phone, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Nama dan email wajib diisi' });
    }

    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing && existing.id !== parseInt(id)) {
      return res.status(409).json({ message: 'Email sudah digunakan' });
    }

    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        affiliation: affiliation || null,
        phone: phone || null,
        role: role || 'member',
      },
      select: {
        id: true,
        name: true,
        email: true,
        affiliation: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
  } catch (err) {
    next(err);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({ where: { id: parseInt(id) } });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await prisma.member.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.updateMemberProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, affiliation, bio, avatarUrl, interests } = req.body;

    if (req.member.id !== parseInt(id) && req.member.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phone,
        affiliation,
        bio,
        avatarUrl,
        interests: interests ? { set: interests } : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        affiliation: true,
        bio: true,
        avatarUrl: true,
        interests: true,
        role: true,
      },
    });

    res.status(200).json({ message: 'Profile updated successfully', member: updatedMember });
  } catch (err) {
    next(err);
  }
};
