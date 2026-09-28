const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mammoth = require("mammoth");
const { protect } = require("../middleware/auth");

// In-memory multer storage to enable sharp optimization before saving
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|gif|webp/;
    const ext = allowedExts.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = /^image\/(jpeg|png|gif|webp)$/;
    const mime = allowedMimes.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar valid (jpeg, jpg, png, gif, webp) yang diizinkan"));
    }
  },
});

const docUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/msword"
    ];
    if ((ext === ".docx" || ext === ".txt") && (allowedMimes.includes(file.mimetype) || file.mimetype === "application/octet-stream")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file .docx atau .txt yang diizinkan"));
    }
  },
});

// Single image upload route with automatic Sharp WebP conversion
router.post("/", protect, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });

    try {
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const targetPath = path.join(uploadDir, filename);

      // Auto-orient via EXIF, clamp bounds to 1920x1080, convert to high-efficiency WebP
      await sharp(req.file.buffer)
        .rotate()
        .resize({
          width: 1920,
          height: 1080,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 4 })
        .toFile(targetPath);

      res.json({ url: `/uploads/${filename}` });
    } catch (processErr) {
      console.error("Image processing error:", processErr);
      res.status(500).json({ message: "Gagal memproses gambar: " + processErr.message });
    }
  });
});

// Extract plain text from Word (.docx) or .txt for article content
router.post("/extract-text", protect, (req, res) => {
  docUpload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });

      const ext = path.extname(req.file.originalname).toLowerCase();
      let text = "";

      if (ext === ".txt") {
        text = req.file.buffer.toString("utf8");
      } else {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = (result.value || "").trim();
      }

      if (!text) {
        return res.status(400).json({ message: "Tidak ada teks yang bisa diekstrak dari file" });
      }

      res.json({ text, filename: req.file.originalname });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Gagal mengekstrak teks" });
    }
  });
});

module.exports = router;
