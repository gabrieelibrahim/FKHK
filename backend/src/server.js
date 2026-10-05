const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust nginx proxy
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
}));
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://fkhk-test.vantaracloud.web.id')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // izinkan request tanpa origin (curl, server-to-server, same-origin)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin tidak diizinkan oleh CORS: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ====== RATE LIMIT TOGGLE (superadmin-controlled, persisted di DB) ======
const { isRateLimitDisabled, skipForSuperadmin } = require('./controllers/settingsController');

// Cache flag agar tidak query DB di setiap request
let rateLimitOff = false;
let lastCheck = 0;
const CHECK_INTERVAL_MS = 5000;

function rateLimitSkip(req) {
  // Superadmin selalu lolos rate limit
  if (skipForSuperadmin(req)) return true;
  // Refresh cache dari DB maksimal tiap 5 detik
  const now = Date.now();
  if (now - lastCheck > CHECK_INTERVAL_MS) {
    lastCheck = now;
    isRateLimitDisabled()
      .then((v) => { rateLimitOff = v; })
      .catch(() => {});
  }
  return rateLimitOff;
}

// Limiter ketat untuk endpoint sensitif: login, forgot, reset, newsletter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam beberapa saat.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: rateLimitSkip,
});

// Limiter aman untuk sosialisasi dan operasional admin
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Terlalu banyak percobaan login. Coba lagi dalam beberapa saat.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: rateLimitSkip,
});

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Terlalu banyak permintaan. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: rateLimitSkip,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: rateLimitSkip,
});

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const eventRoutes = require('./routes/events');
const newsletterRoutes = require('./routes/newsletter');
const achievementRoutes = require('./routes/achievements');
const officerRoutes = require('./routes/officers');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./controllers/settingsController').router;

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
// Limiter ketat khusus presensi: anti-spam & anti-crawl NIM (harus sebelum eventRoutes)
const presensiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak percobaan presensi dari perangkat ini. Tunggu beberapa saat.' },
  skip: rateLimitSkip,
});
app.use('/api/events/presensi/record', presensiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FKHK Backend API is running!', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
