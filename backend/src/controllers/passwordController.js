const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const mailer = require('../utils/mailer');

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const member = await prisma.member.findUnique({ where: { email } });

    // Jangan bocorin apakah email ada atau nggak — respons selalu sama
    if (member) {
      // Invalidate token lama, buat baru
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

      await prisma.member.update({
        where: { id: member.id },
        data: {
          resetToken: token,
          resetTokenExpiry: expires,
        },
      });

      mailer
        .sendPasswordResetEmail(member.email, member.name, token)
        .catch((err) => console.error('Reset mail error:', err.message));
    }

    res.json({ message: 'Jika email terdaftar, tautan reset password telah dikirim.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token dan password baru wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    const member = await prisma.member.findUnique({ where: { resetToken: token } });
    if (!member || !member.resetTokenExpiry || member.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.member.update({
      where: { id: member.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Password berhasil direset. Silakan login.' });
  } catch (err) {
    next(err);
  }
};
