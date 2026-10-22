const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { protect, authorize } = require('../middleware/auth');

const SETTING_KEY = 'rate_limit_disabled';

async function isRateLimitDisabled() {
  try {
    const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    return row ? row.value === 'true' : false;
  } catch {
    return false;
  }
}

// Middleware: rate limit bypass untuk superadmin
// Superadmin selalu lolos rate limit agar tidak terkunci saat troubleshooting
const skipForSuperadmin = (req) => {
  return Boolean(req.member && req.member.role === 'superadmin');
};

module.exports = {
  router,
  SETTING_KEY,
  isRateLimitDisabled,
  skipForSuperadmin,
};

// GET /api/settings/rate-limit — status toggle (khusus superadmin)
router.get('/rate-limit', protect, authorize('superadmin'), async (req, res, next) => {
  try {
    const disabled = await isRateLimitDisabled();
    res.json({ disabled, updatedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings/rate-limit — toggle on/off (khusus superadmin)
router.put('/rate-limit', protect, authorize('superadmin'), async (req, res, next) => {
  try {
    const { disabled } = req.body;
    if (typeof disabled !== 'boolean') {
      return res.status(400).json({ message: 'Field "disabled" (boolean) wajib diisi' });
    }
    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: disabled ? 'true' : 'false' },
      create: { key: SETTING_KEY, value: disabled ? 'true' : 'false' },
    });
    res.json({ disabled, updatedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});
