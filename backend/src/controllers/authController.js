const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { loginSchema } = require('../utils/validation');

const generateToken = (member) => {
  return jwt.sign(
    { id: member.id, email: member.email, role: member.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '1d' }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    const member = await prisma.member.findUnique({ where: { email } });
    if (!member) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, member.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(member);

    res.status(200).json({
      message: 'Login successful',
      token,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role,
        mustChangePassword: member.mustChangePassword || false,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.member.id },
      select: { id: true, email: true, name: true, role: true, affiliation: true, avatarUrl: true, mustChangePassword: true },
    });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-password — ganti password sendiri (dari dashboard, termasuk pemaksaan ganti password awal)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan password baru wajib diisi' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    const member = await prisma.member.findUnique({ where: { id: req.member.id } });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, member.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password lama salah' });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.member.update({
      where: { id: member.id },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
    });

    res.status(200).json({ message: 'Password berhasil diganti' });
  } catch (err) {
    next(err);
  }
};
