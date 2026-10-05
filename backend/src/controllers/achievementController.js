const prisma = require('../lib/prisma');

const initialsFor = (name) =>
  name.trim().split(/\s+/).map((part) => part[0]).join('').substring(0, 2).toUpperCase();

exports.getAchievements = async (req, res) => {
  try {
    const data = await prisma.achievement.findMany({ orderBy: { createdAt: 'asc' } });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data prestasi' });
  }
};

const VALID_CATEGORIES = ['kompetisi', 'jurnal', 'konferensi'];

exports.createAchievement = async (req, res) => {
  const { name, title, year, event, photo, category } = req.body;
  if (!name || !title || !year) {
    return res.status(400).json({ message: 'Nama, prestasi, dan tahun wajib diisi' });
  }
  const cat = VALID_CATEGORIES.includes(category) ? category : 'konferensi';
  try {
    const achievement = await prisma.achievement.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        year: String(year).trim(),
        event: event && event.trim() ? event.trim() : null,
        category: cat,
        initials: initialsFor(name),
        photo: photo || null,
      },
    });
    res.status(201).json(achievement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat prestasi' });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

    const { name, title, year, event, photo, category } = req.body;
    if (!name || !title || !year) {
      return res.status(400).json({ message: 'Nama, prestasi, dan tahun wajib diisi' });
    }
    const cat = VALID_CATEGORIES.includes(category) ? category : achievement.category;

    const updated = await prisma.achievement.update({
      where: { id: Number(req.params.id) },
      data: {
        name: name.trim(),
        title: title.trim(),
        year: String(year).trim(),
        event: event !== undefined ? (event && event.trim() ? event.trim() : null) : achievement.event,
        category: cat,
        initials: initialsFor(name),
        photo: photo !== undefined ? (photo || null) : achievement.photo,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui prestasi' });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

    await prisma.achievement.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus prestasi' });
  }
};
