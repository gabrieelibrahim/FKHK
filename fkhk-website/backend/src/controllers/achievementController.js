const mockAchievements = [
  { id: 1, name: "M. Riziq Fauzi", title: "Juara 1 Lomba Esai Hukum Nasional", year: "2026", initials: "MR" },
  { id: 2, name: "Aulia Eka Salsabila", title: "Publikasi di Jurnal Terakreditasi Sinta 3", year: "2026", initials: "AE" },
  { id: 3, name: "Najma Ulya I.", title: "Pembicara Seminar Regional Hukum Islam", year: "2025", initials: "NU" },
  { id: 4, name: "Nabila Febryanti", title: "Juara 2 Debat Hukum Antar Kampus", year: "2025", initials: "NF" },
];
let nextId = 5;

exports.getAchievements = (req, res) => {
  res.json({ data: mockAchievements });
};

exports.createAchievement = (req, res) => {
  const { name, title, year } = req.body;
  if (!name || !title || !year) {
    return res.status(400).json({ message: 'Nama, prestasi, dan tahun wajib diisi' });
  }
  const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  const achievement = { id: nextId++, name, title, year, initials };
  mockAchievements.push(achievement);
  res.status(201).json(achievement);
};
