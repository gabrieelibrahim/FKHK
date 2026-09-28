const prisma = require('../lib/prisma');

const ADMIN_ROLES = ['superadmin', 'admin_kaset', 'admin_psdm', 'admin'];

// GET /api/comments/article/:articleId — public (approved) + own pending if logged in
exports.getArticleComments = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId);
    if (!articleId) return res.status(400).json({ message: 'Invalid article id' });

    const where = { articleId };
    if (req.member) {
      // approved comments OR member's own comments (any status)
      where.OR = [
        { isApproved: true },
        { memberId: req.member.id },
      ];
    } else {
      where.isApproved = true;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: { member: { select: { id: true, name: true, affiliation: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ data: comments, total: comments.length });
  } catch (err) {
    next(err);
  }
};

// POST /api/comments/article/:articleId — auth required
exports.createComment = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 2) {
      return res.status(400).json({ message: 'Komentar minimal 2 karakter' });
    }
    if (content.trim().length > 1000) {
      return res.status(400).json({ message: 'Komentar maksimal 1000 karakter' });
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article || article.status !== 'published') {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        memberId: req.member.id,
        content: content.trim(),
        isApproved: false,
      },
      include: { member: { select: { id: true, name: true, affiliation: true } } },
    });

    res.status(201).json({ message: 'Komentar terkirim, menunggu moderasi.', data: comment });
  } catch (err) {
    next(err);
  }
};

// GET /api/comments?status=pending|approved — admin only
exports.listComments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status === 'pending') where.isApproved = false;
    if (status === 'approved') where.isApproved = true;

    const comments = await prisma.comment.findMany({
      where,
      include: {
        member: { select: { id: true, name: true, email: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const [pending, approved] = await Promise.all([
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.comment.count({ where: { isApproved: true } }),
    ]);

    res.json({ data: comments, total: comments.length, counts: { pending, approved } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/comments/:id/approve — admin
exports.approveComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const updated = await prisma.comment.update({
      where: { id },
      data: { isApproved: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/comments/:id — admin or author
exports.deleteComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.memberId !== req.member.id && !ADMIN_ROLES.includes(req.member.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};
