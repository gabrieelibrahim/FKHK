const express = require('express');

const mockArticles = [
  { id: 1, title: "Pola Pengasuhan Anak dalam Perspektif Hukum Islam", slug: "pola-pengasuhan-anak", content: "Kajian tentang bagaimana hukum Islam memandang kewajiban orang tua dalam proses pengasuhan anak...", excerpt: "Kajian tentang bagaimana hukum Islam memandang kewajiban orang tua dalam proses pengasuhan anak.", topic: "Parenting & Keluarga", tags: ["parenting", "hukum-keluarga"], status: "published", viewCount: 145, isFeatured: true, publishedAt: "2026-07-12T00:00:00Z", createdAt: "2026-07-10T00:00:00Z", authorId: 1, author: { id: 1, name: "Ela Nur Hidayati", email: "ela@fkhk.id", affiliation: "UIN Sunan Kalijaga" } },
  { id: 2, title: "Dispensasi Perkawinan: Dilema Perlindungan Anak dan Kepastian Hukum", slug: "dispensasi-perkawinan", content: "Analisis yuridis terhadap praktik dispensasi perkawinan anak di pengadilan...", excerpt: "Analisis yuridis terhadap praktik dispensasi perkawinan anak di pengadilan.", topic: "Pernikahan", tags: ["pernikahan", "perlindungan-anak"], status: "published", viewCount: 234, isFeatured: true, publishedAt: "2026-07-05T00:00:00Z", createdAt: "2026-07-03T00:00:00Z", authorId: 2, author: { id: 2, name: "M. Riziq Fauzi", email: "riziq@fkhk.id", affiliation: "UIN Sunan Kalijaga" } },
  { id: 3, title: "Analisis Putusan Hakim dalam Sengketa Hak Asuh Anak", slug: "analisis-putusan-hakim-asuh", content: "Studi komparatif terhadap pertimbangan hukum hakim...", excerpt: "Studi komparatif terhadap pertimbangan hukum hakim dalam memutus perkara hak asuh anak.", topic: "Studi Putusan", tags: ["hak-asuh", "perceraian"], status: "published", viewCount: 89, isFeatured: true, publishedAt: "2026-06-28T00:00:00Z", createdAt: "2026-06-25T00:00:00Z", authorId: 3, author: { id: 3, name: "Najma Ulya I.", email: "najma@fkhk.id" } },
  { id: 4, title: "Pembagian Warisan dalam Hukum Islam di Era Modern", slug: "pembagian-warisan-Islam", content: "Telaah komprehensif tentang penerapan faraid...", excerpt: "Telaah komprehensif tentang penerapan faraid dalam konteks keluarga modern.", topic: "Hukum Waris", tags: ["waris", "faraid"], status: "published", viewCount: 67, isFeatured: false, publishedAt: "2026-06-20T00:00:00Z", createdAt: "2026-06-18T00:00:00Z", authorId: 4, author: { id: 4, name: "Ahmad Fauzi", email: "ahmad@fkhk.id" } },
  { id: 5, title: "Nikah Siri: Perspektif Hukum dan HAM", slug: "nikah-siri-hukum-ham", content: "Kajian terhadap fenomena nikah siri di Indonesia...", excerpt: "Kajian terhadap fenomena nikah siri di Indonesia.", topic: "Pernikahan", tags: ["nikah-siri", "ham"], status: "published", viewCount: 156, isFeatured: false, publishedAt: "2026-06-10T00:00:00Z", createdAt: "2026-06-08T00:00:00Z", authorId: 1, author: { id: 1, name: "Ela Nur Hidayati", email: "ela@fkhk.id" } },
];

const mockEvents = [
  { id: 1, title: "Seminar Nasional: Reformasi Hukum Keluarga di Era Modern", slug: "seminar-nasional-reformasi", description: "Seminar nasional dengan pembicara dari berbagai universitas terkemuka di Indonesia. Akan membahas isu-isu terkini seputar reformasi hukum keluarga di Indonesia.\n\nPembicara:\n1. Prof. Dr. H. Ahmad Syaiful Aziz, M.Ag.\n2. Dr. Nurul Huda, S.H., M.H.\n3. Dr. Hj. Siti Aminah, M.H.I.", dateTime: "2026-07-20T09:00:00Z", location: "Aula Kampus, Gedung A Lt. 3", capacity: 150, status: "upcoming", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", createdAt: "2026-06-01T00:00:00Z", createdById: 1, createdBy: { id: 1, name: "Admin FKHK", email: "admin@fkhk.id" }, _count: { registrations: 45 }, isRegistered: false },
  { id: 2, title: "Diskusi Bulanan: Problematika Wali Nikah", slug: "diskusi-bulanan-wali-nikah", description: "Diskusi rutin bulanan FKHK membahas problematika wali nikah dalam kasus kontemporer.", dateTime: "2026-06-15T14:00:00Z", location: "Ruang Diskusi FKHK", capacity: 50, status: "completed", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80", createdAt: "2026-05-20T00:00:00Z", createdById: 1, createdBy: { id: 1, name: "Admin FKHK" }, _count: { registrations: 30 }, isRegistered: false },
  { id: 3, title: "Workshop Penulisan Karya Ilmiah", slug: "workshop-penulisan-ilmiah", description: "Workshop penulisan karya ilmiah untuk jurnal terakreditasi.", dateTime: "2026-06-03T09:00:00Z", location: "Lab Komputer Fakultas", capacity: 30, status: "completed", imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80", createdAt: "2026-05-15T00:00:00Z", createdById: 1, createdBy: { id: 1, name: "Admin FKHK" }, _count: { registrations: 25 }, isRegistered: false },
];

const mockMembers = [
  { id: 1, name: "Admin FKHK", email: "admin@fkhk.id", affiliation: "FKHK", role: "admin", createdAt: "2026-01-01T00:00:00Z" },
  { id: 2, name: "Ela Nur Hidayati", email: "ela@fkhk.id", affiliation: "UIN Sunan Kalijaga", role: "member", createdAt: "2026-02-15T00:00:00Z" },
  { id: 3, name: "M. Riziq Fauzi", email: "riziq@fkhk.id", affiliation: "UIN Sunan Kalijaga", role: "member", createdAt: "2026-03-01T00:00:00Z" },
  { id: 4, name: "Najma Ulya I.", email: "najma@fkhk.id", affiliation: "UIN Sunan Kalijaga", role: "member", createdAt: "2026-03-10T00:00:00Z" },
];

const router = express.Router();

// Auth
router.post('/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email and password are required' });
  const member = mockMembers.find(m => m.email === email);
  if (!member) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful', token: 'mock_token_' + member.id, member });
});

// Articles
router.get('/articles', (req, res) => {
  const { topic, search, page = 1, limit = 10 } = req.query;
  let filtered = [...mockArticles];
  if (topic) filtered = filtered.filter(a => a.topic === topic);
  if (search) filtered = filtered.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.length;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const paginated = filtered.slice(skip, skip + parseInt(limit));
  res.json({ data: paginated, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) });
});

router.get('/articles/featured', (req, res) => {
  res.json({ data: mockArticles.filter(a => a.isFeatured) });
});

router.get('/articles/:slug', (req, res) => {
  const article = mockArticles.find(a => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  article.viewCount += 1;
  res.json(article);
});

// Events
router.get('/events', (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  let filtered = [...mockEvents];
  if (status) filtered = filtered.filter(e => e.status === status);
  const total = filtered.length;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  res.json({ data: filtered.slice(skip, skip + parseInt(limit)), total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) });
});

router.get('/events/:slug', (req, res) => {
  const event = mockEvents.find(e => e.slug === req.params.slug);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// Members
router.get('/members', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const total = mockMembers.length;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  res.json({ data: mockMembers.slice(skip, skip + parseInt(limit)), total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) });
});

router.get('/members/:id', (req, res) => {
  const member = mockMembers.find(m => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
});

// Newsletter
router.post('/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  res.status(201).json({ message: 'Subscription successful! Check your email for confirmation.' });
});

router.post('/newsletter/unsubscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  res.json({ message: 'Successfully unsubscribed.' });
});

module.exports = router;
