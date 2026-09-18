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
      select: { id: true, email: true, name: true, role: true, affiliation: true, avatarUrl: true },
    });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
};
