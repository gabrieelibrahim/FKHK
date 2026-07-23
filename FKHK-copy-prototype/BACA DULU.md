# 🚀 FKHK Website — Panduan Menjalankan

## 📋 Persiapan

1. **Extract ZIP** ke folder mana aja (contoh: `C:\FKHK`)

2. **Double click `setup.bat`** — otomatis:
   - Install Node.js (kalo belum ada)
   - Install semua dependencies
   - Setup database SQLite
   - Build frontend
   - Tunggu sampai **"SETUP SELESAI"**

## ▶️ Menjalankan

1. **Double click `start.bat`** — muncul 2 jendela cmd
2. **Buka browser**: [http://localhost:3000](http://localhost:3000)

## ⏹️ Mematikan
- Tutup 2 jendela cmd (backend + frontend)

## ❓ Troubleshooting

| Masalah | Solusi |
|---|---|
| `setup.bat` gagal | Buka cmd → `cd C:\...\FKHK` → ketik `setup.bat` (lihat errornya) |
| Port 3000/3001 dipake | Matikan program lain (Skype, dll) |
| Register akun? | Buka `/auth/register` dulu |

## 📧 Fitur Email (Opsional)

Kalo butuh notifikasi email, isi `backend/.env`:

```
SMTP_USER=email_komunitas@gmail.com
SMTP_PASS=app_password_gmail
```

---

Dibuat dengan ❤️ oleh FKHK Dev Team
