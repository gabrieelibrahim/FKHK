const mockAchievements = [
  { id: 1, name: "M. Riziq Fauzi", title: "Juara 1 Lomba Esai Hukum Nasional", year: "2026", initials: "MR" },
  { id: 2, name: "Aulia Eka Salsabila", title: "Publikasi di Jurnal Terakreditasi Sinta 3", year: "2026", initials: "AE" },
  { id: 3, name: "Najma Ulya I.", title: "Pembicara Seminar Regional Hukum Islam", year: "2025", initials: "NU" },
  { id: 4, name: "Nabila Febryanti", title: "Juara 2 Debat Hukum Antar Kampus", year: "2025", initials: "NF" },
];
let nextId = 5;

const initialsFor = (name) => name.trim().split(/\s+/).map((part) => part[0]).join('').substring(0, 2).toUpperCase();

exports.getAchievements = (req, res) => {
  res.json({ data: mockAchievements });
};

exports.createAchievement = (req, res) => {
  const { name, title, year } = req.body;
  if (!name || !title || !year) {
    return res.status(400).json({ message: 'Nama, prestasi, dan tahun wajib diisi' });
  }
  const achievement = { id: nextId++, name: name.trim(), title: title.trim(), year: String(year).trim(), initials: initialsFor(name) };
  mockAchievements.push(achievement);
  res.status(201).json(achievement);
};

exports.updateAchievement = (req, res) => {
  const achievement = mockAchievements.find((item) => item.id === Number(req.params.id));
  if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

  const { name, title, year } = req.body;
  if (!name || !title || !year) {
    return res.status(400).json({ message: 'Nama, prestasi, dan tahun wajib diisi' });
  }
  achievement.name = name.trim();
  achievement.title = title.trim();
  achievement.year = String(year).trim();
  achievement.initials = initialsFor(achievement.name);
  return res.status(200).json(achievement);
};

exports.deleteAchievement = (req, res) => {
  const index = mockAchievements.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Achievement not found' });
  mockAchievements.splice(index, 1);
  return res.status(200).json({ message: 'Achievement deleted successfully' });
};
