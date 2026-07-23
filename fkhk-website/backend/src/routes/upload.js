const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).substring(2, 8) + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Hanya file gambar (jpeg, jpg, png, gif, webp) yang diizinkan'));
  },
});

const docUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.docx' || ext === '.txt') cb(null, true);
    else cb(new Error('Hanya file .docx atau .txt yang diizinkan'));
  },
});

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Extract plain text from Word (.docx) or .txt for article content
router.post('/extract-text', protect, docUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let text = '';

    if (ext === '.txt') {
      text = req.file.buffer.toString('utf8');
    } else {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = (result.value || '').trim();
    }

    if (!text) {
      return res.status(400).json({ message: 'Tidak ada teks yang bisa diekstrak dari file' });
    }

    res.json({ text, filename: req.file.originalname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Gagal mengekstrak teks' });
  }
});

module.exports = router;
