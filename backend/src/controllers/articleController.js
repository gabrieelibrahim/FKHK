const prisma = require('../lib/prisma');
const mailer = require('../utils/mailer');

const ADMIN_ROLES = ['superadmin', 'admin_kaset', 'admin_psdm', 'admin_bph', 'admin'];
const isAnyAdmin = (role) => ADMIN_ROLES.includes(role);
const canManageArticles = (role) => ['superadmin', 'admin_kaset'].includes(role);

// Ringkasan dari paragraf isi pertama, dipotong di batas kata
const autoExcerpt = (content) => {
  const first = content.split(/\n{2,}/).map((p) => p.trim()).find((p) => p.length > 60) || content.trim();
  if (first.length <= 200) return first;
  return first.slice(0, 200).replace(/\s+\S*$/, '') + '…';
};

// Penulis yang boleh dipilih admin artikel: anggota FKHK aktif (bukan akun admin divisi)
const resolveAuthorId = async (authorId) => {
  const id = parseInt(authorId);
  if (!id) return null;
  const member = await prisma.member.findFirst({
    where: { id, role: 'member', isActive: true },
    select: { id: true },
  });
  return member ? member.id : null;
};

exports.getAuthorOptions = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      where: { role: 'member', isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
    res.json({ data: members });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, topic, search, status, mine } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (mine === 'true' && req.member) {
      where.authorId = req.member.id;
    } else if (isAnyAdmin(req.member?.role)) {
      if (status) where.status = status;
    } else {
      where.status = 'published';
    }

    if (topic) where.topic = topic;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        topic: true,
        tags: true,
        status: true,
        viewCount: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: { id: true, name: true, affiliation: true },
        },
      },
    });

    const total = await prisma.article.count({ where });

    // Tambah readingMinutes (200 kata/menit), buang content dari response
    const withReadingTime = articles.map(({ content, ...rest }) => ({
      ...rest,
      readingMinutes: Math.max(1, Math.ceil((content || '').trim().split(/\s+/).filter(Boolean).length / 200)),
    }));

    res.json({
      data: withReadingTime,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getArticleBySlug = async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: {
          select: { id: true, name: true, email: true, affiliation: true, avatarUrl: true },
        },
      },
    });

    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Unpublished: author or admin only
    if (article.status !== 'published') {
      const member = req.member;
      const isAuthor = member && member.id === article.authorId;
      const isAdmin = member && isAnyAdmin(member.role);
      if (!isAuthor && !isAdmin) {
        return res.status(404).json({ message: 'Article not found' });
      }
    } else {
      // Increment view count for public published only
      prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      }).catch(() => {});
    }

    res.json(article);
  } catch (err) {
    next(err);
  }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      where: { isFeatured: true, status: 'published' },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        topic: true, publishedAt: true,
        author: { select: { name: true } },
      },
    });
    res.json({ data: articles });
  } catch (err) {
    next(err);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    const { title, content, excerpt, topic, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    let authorId = req.member.id;
    if (req.body.authorId && canManageArticles(req.member.role)) {
      authorId = await resolveAuthorId(req.body.authorId);
      if (!authorId) return res.status(400).json({ message: 'Penulis harus anggota FKHK yang aktif' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || autoExcerpt(content),
        references: (req.body.references || '').trim() || null,
        imageUrl: req.body.imageUrl || null,
        topic: topic || 'General',
        tags: tags || [],
        authorId,
        status: 'submitted', // langsung antre publish admin
      },
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Only author or admin with article permission can update
    if (article.authorId !== req.member.id && !canManageArticles(req.member.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, excerpt, topic, tags, status, imageUrl } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (req.body.references !== undefined) data.references = (req.body.references || '').trim() || null;
    if (topic !== undefined) data.topic = topic;
    if (tags !== undefined) data.tags = { set: tags };
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (req.body.authorId !== undefined && canManageArticles(req.member.role)) {
      const authorId = await resolveAuthorId(req.body.authorId);
      if (!authorId) return res.status(400).json({ message: 'Penulis harus anggota FKHK yang aktif' });
      data.authorId = authorId;
    }

    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data,
      include: { author: { select: { id: true, name: true } } },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.authorId !== req.member.id && !canManageArticles(req.member.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.article.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    next(err);
  }
};

exports.submitArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.authorId !== req.member.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (article.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft articles can be submitted' });
    }
    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { status: 'submitted' },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.approveArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.status !== 'submitted') {
      return res.status(400).json({ message: 'Only submitted articles can be approved' });
    }
    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { status: 'published', publishedAt: new Date() },
    });
    // notify subscribers
    prisma.newsletterSubscriber.findMany({ where: { unsubscribedAt: null } })
      .then((subs) => mailer.sendNewArticleNotification(subs, updated))
      .catch(() => {});
    res.json(updated);
  } catch (err) { next(err); }
};

exports.rejectArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.status !== 'submitted') {
      return res.status(400).json({ message: 'Only submitted articles can be rejected' });
    }
    const updated = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { status: 'draft' },
    });
    res.json(updated);
  } catch (err) { next(err); }
};
