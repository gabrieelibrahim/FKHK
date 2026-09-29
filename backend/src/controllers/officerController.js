const prisma = require('../lib/prisma');

const initialsFor = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

exports.getOfficers = async (req, res) => {
  try {
    const { category, all } = req.query;
    const where = {};
    if (category) {
      where.category = String(category);
    }
    if (all !== 'true') {
      where.isActive = true;
    }
    const data = await prisma.officer.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data pengurus' });
  }
};

exports.createOfficer = async (req, res) => {
  const { name, position, category, order, photo, isActive } = req.body;
  if (!name || !position) {
    return res.status(400).json({ message: 'Nama dan jabatan wajib diisi' });
  }
  try {
    const officer = await prisma.officer.create({
      data: {
        name: name.trim(),
        position: position.trim(),
        category: category ? String(category).trim() : 'bph',
        order: Number(order) || 0,
        initials: initialsFor(name),
        photo: photo || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    res.status(201).json(officer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan pengurus' });
  }
};

exports.updateOfficer = async (req, res) => {
  try {
    const officer = await prisma.officer.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!officer) return res.status(404).json({ message: 'Pengurus tidak ditemukan' });

    const { name, position, category, order, photo, isActive } = req.body;
    if (!name || !position) {
      return res.status(400).json({ message: 'Nama dan jabatan wajib diisi' });
    }

    const updated = await prisma.officer.update({
      where: { id: Number(req.params.id) },
      data: {
        name: name.trim(),
        position: position.trim(),
        category: category ? String(category).trim() : officer.category,
        order: order !== undefined ? Number(order) : officer.order,
        initials: initialsFor(name),
        photo: photo !== undefined ? (photo || null) : officer.photo,
        isActive: isActive !== undefined ? Boolean(isActive) : officer.isActive,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui pengurus' });
  }
};

exports.deleteOfficer = async (req, res) => {
  try {
    const officer = await prisma.officer.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!officer) return res.status(404).json({ message: 'Pengurus tidak ditemukan' });

    await prisma.officer.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ message: 'Pengurus berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus pengurus' });
  }
};
