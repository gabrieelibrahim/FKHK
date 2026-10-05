const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mammoth = require("mammoth");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
const { protect, authorize } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter: (req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|gif|webp|heic|heif/;
    const ext = allowedExts.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = /^image\/(jpeg|png|gif|webp|heic|heif|heic-sequence|heif-sequence)$/i;
    const isMimeOk = allowedMimes.test(file.mimetype) || file.mimetype === "application/octet-stream";

    if (ext || isMimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar valid (jpeg, jpg, png, gif, webp, heic, heif) yang diizinkan"));
    }
  },
});

const docUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/msword",
      "application/pdf"
    ];
    if ((ext === ".docx" || ext === ".txt" || ext === ".pdf") && (allowedMimes.includes(file.mimetype) || file.mimetype === "application/octet-stream")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file .docx, .txt, atau .pdf yang diizinkan"));
    }
  },
});

// Helper function untuk mendecode HEIC/HEIF menggunakan heif-convert (libde265 HEVC)
async function decodeHeicToJpegBuffer(inputBuffer) {
  const tmpId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const tmpInput = path.join("/tmp", `raw-${tmpId}.heic`);
  const tmpOutput = path.join("/tmp", `conv-${tmpId}.jpg`);

  try {
    await fs.promises.writeFile(tmpInput, inputBuffer);
    await execFileAsync("heif-convert", [tmpInput, tmpOutput]);
    const convertedJpeg = await fs.promises.readFile(tmpOutput);
    return convertedJpeg;
  } finally {
    fs.promises.unlink(tmpInput).catch(() => {});
    fs.promises.unlink(tmpOutput).catch(() => {});
  }
}

// Single image upload route with automatic WebP conversion
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

      let imageBuffer = req.file.buffer;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const isHeic = ext === ".heic" || ext === ".heif" || req.file.mimetype.includes("heic") || req.file.mimetype.includes("heif");

      if (isHeic) {
        try {
          imageBuffer = await decodeHeicToJpegBuffer(imageBuffer);
        } catch (heicErr) {
          console.error("heif-convert error in upload route:", heicErr);
        }
      }

      await sharp(imageBuffer)
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

// Endpoint konversi HEIC -> JPEG dataUrl untuk interactive crop di modal browser
router.post("/convert-heic", protect, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });

    try {
      // Decode HEIC via heif-convert (dukung HEVC iPhone / Android secara native)
      const decodedJpeg = await decodeHeicToJpegBuffer(req.file.buffer);

      // Clamp dan kompres dengan Sharp agar ringan di preview crop modal HP
      const optimizedJpeg = await sharp(decodedJpeg)
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      const base64Data = `data:image/jpeg;base64,${optimizedJpeg.toString("base64")}`;
      res.json({ dataUrl: base64Data });
    } catch (err) {
      console.error("HEIC conversion error:", err);
      res.status(500).json({ message: "Gagal mengonversi file HEIC: " + (err.stderr || err.message) });
    }
  });
});

// Extract plain text from Word (.docx), .txt, or PDF for article content
// File diproses di memori dan TIDAK disimpan ke disk — hemat storage server.
router.post("/extract-text", protect, authorize("superadmin", "admin_kaset"), (req, res) => {
  docUpload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });

      const ext = path.extname(req.file.originalname).toLowerCase();
      let text = "";

      if (ext === ".txt") {
        text = req.file.buffer.toString("utf8");
      } else if (ext === ".pdf") {
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(req.file.buffer);
        text = (pdfData.text || "").trim();
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
