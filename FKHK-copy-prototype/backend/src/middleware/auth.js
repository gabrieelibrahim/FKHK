const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.member = await prisma.member.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!req.member) {
        return res.status(401).json({ message: 'Not authorized, member not found' });
      }

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

exports.optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.member = await prisma.member.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (_) {
      // Token invalid atau ga ada — biarin aja, req.member tetap undefined
    }
  }
  next();
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.member.role)) {
      return res.status(403).json({
        message: `Role ${req.member.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
