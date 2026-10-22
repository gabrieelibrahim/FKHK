const prisma = require('../lib/prisma');

exports.subscribe = async (req, res, next) => {
  try {
    const { email, name, interestedTopics } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (typeof email !== 'string' || email.length > 254) {
      return res.status(400).json({ message: 'Email terlalu panjang (maksimal 254 karakter).' });
    }

    if (name && (typeof name !== 'string' || name.length > 100)) {
      return res.status(400).json({ message: 'Nama terlalu panjang (maksimal 100 karakter).' });
    }

    if (interestedTopics && (!Array.isArray(interestedTopics) || interestedTopics.length > 10 || interestedTopics.some(t => typeof t !== 'string' || t.length > 50))) {
      return res.status(400).json({ message: 'Topik minat tidak valid atau melebihi batas.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.unsubscribedAt) {
        // Re-subscribe
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            unsubscribedAt: null,
            name: name || existing.name,
            interestedTopics: interestedTopics ? { set: interestedTopics } : existing.interestedTopics,
          },
        });
        return res.json({ message: 'Subscription reactivated. Welcome back!' });
      }
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: name || null,
        interestedTopics: interestedTopics || [],
      },
    });

    res.status(201).json({ message: 'Subscription successful! Check your email for confirmation.' });
  } catch (err) {
    next(err);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found in our list' });
    }

    if (subscriber.unsubscribedAt) {
      return res.json({ message: 'Email was already unsubscribed' });
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { unsubscribedAt: new Date() },
    });

    res.json({ message: 'Successfully unsubscribed. Sorry to see you go!' });
  } catch (err) {
    next(err);
  }
};

exports.status = async (req, res, next) => {
  try {
    const [total, verified] = await Promise.all([
      prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
      prisma.newsletterSubscriber.count({ where: { isVerified: true, unsubscribedAt: null } }),
    ]);

    res.json({ total, verified });
  } catch (err) {
    next(err);
  }
};
