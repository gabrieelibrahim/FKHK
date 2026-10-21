const prisma = require('../lib/prisma');
const { formatLetterNumber, previewNextNumber, SUBJECT_CODES, DIVISION_CODES } = require('../utils/letterNumber');

/**
 * GET /api/letters
 * List buku arsip surat keluar dengan filter & pencarian
 */
exports.getLetters = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      scope,
      subjectCode,
      year,
    } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const where = {};

    if (status) {
      where.status = status;
    }

    if (scope) {
      where.scope = scope;
    }

    if (subjectCode) {
      where.subjectCode = subjectCode;
    }

    if (year) {
      const yr = parseInt(year, 10);
      where.issuedAt = {
        gte: new Date(`${yr}-01-01T00:00:00.000Z`),
        lte: new Date(`${yr}-12-31T23:59:59.999Z`),
      };
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { letterNumber: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
        { recipientName: { contains: q, mode: 'insensitive' } },
        { recipientOrg: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [letters, total] = await Promise.all([
      prisma.officialLetter.findMany({
        where,
        skip,
        take,
        orderBy: [
          { issuedAt: 'desc' },
          { sequenceNumber: 'desc' },
        ],
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.officialLetter.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: letters,
      total,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/letters/:id
 * Detail arsip surat
 */
exports.getLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await prisma.officialLetter.findFirst({
      where: {
        OR: [{ id }, { letterNumber: decodeURIComponent(id) }],
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!letter) {
      return res.status(404).json({ success: false, message: 'Surat tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: letter });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/letters/preview-number
 * Pratinjau string nomor surat berikutnya secara real-time
 */
exports.previewNumber = async (req, res, next) => {
  try {
    const {
      subjectCode = '04',
      scope = 'PUSAT',
      divisionCode,
      committeeCode,
      date,
      scopeKey = 'GLOBAL',
    } = req.query;

    const preview = await previewNextNumber(prisma, {
      subjectCode,
      scope,
      divisionCode,
      committeeCode,
      date: date ? new Date(date) : new Date(),
      scopeKey,
    });

    res.status(200).json({
      success: true,
      ...preview,
      subjectName: SUBJECT_CODES[subjectCode] || 'Tidak Diketahui',
      divisionName: divisionCode ? DIVISION_CODES[divisionCode] || divisionCode : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/letters
 * Terbitkan surat baru secara atomic (mengunci sequence counter)
 */
exports.createLetter = async (req, res, next) => {
  try {
    const {
      subjectCode,
      scope,
      divisionCode,
      committeeCode,
      subject,
      recipientName,
      recipientOrg,
      eventDate,
      contentData,
      withSignature = true,
      withStamp = true,
      issuedAt,
      scopeKey = 'GLOBAL',
    } = req.body;

    if (!subjectCode || !scope || !subject || !recipientName) {
      return res.status(400).json({
        success: false,
        message: 'Kode perihal, lingkup surat, perihal, dan nama penerima wajib diisi',
      });
    }

    if (scope === 'DIVISI' && !divisionCode) {
      return res.status(400).json({
        success: false,
        message: 'Kode divisi wajib dipilih untuk lingkup DIVISI',
      });
    }

    if (scope === 'KEPANITIAAN' && !committeeCode) {
      return res.status(400).json({
        success: false,
        message: 'Kode kepanitiaan wajib diisi untuk lingkup KEPANITIAAN',
      });
    }

    const d = issuedAt ? new Date(issuedAt) : new Date();
    const year = d.getFullYear();

    // Atomic transaction: increment counter and create official_letter
    const letter = await prisma.$transaction(async (tx) => {
      // Upsert atomic sequence counter
      const seqRecord = await tx.letterSequence.upsert({
        where: {
          year_scopeKey: {
            year,
            scopeKey,
          },
        },
        create: {
          year,
          scopeKey,
          lastSeq: 1,
        },
        update: {
          lastSeq: { increment: 1 },
        },
      });

      const sequenceNumber = seqRecord.lastSeq;
      const letterNumber = formatLetterNumber({
        sequence: sequenceNumber,
        subjectCode,
        scope,
        divisionCode,
        committeeCode,
        date: d,
      });

      let formattedCommittee = null;
      if (scope === 'KEPANITIAAN' && committeeCode) {
        const clean = committeeCode.trim().toUpperCase();
        formattedCommittee = clean.startsWith('PTA-') ? clean : `PTA-${clean}`;
      }

      const newLetter = await tx.officialLetter.create({
        data: {
          letterNumber,
          sequenceNumber,
          subjectCode: String(subjectCode).padStart(2, '0'),
          scope,
          divisionCode: scope === 'DIVISI' ? divisionCode : null,
          committeeCode: formattedCommittee,
          subject,
          recipientName,
          recipientOrg: recipientOrg || null,
          eventDate: eventDate ? new Date(eventDate) : null,
          contentData: contentData || {},
          withSignature: Boolean(withSignature),
          withStamp: Boolean(withStamp),
          status: 'ISSUED',
          issuedAt: d,
          createdById: req.member.id,
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });

      return newLetter;
    });

    res.status(201).json({
      success: true,
      message: 'Surat berhasil diterbitkan dan dicatat dalam buku registrasi',
      data: letter,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/letters/:id/void
 * Batalkan surat (nomor tetap tersimpan agar pembukuan tidak bolong)
 */
exports.voidLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { voidReason } = req.body;

    const existing = await prisma.officialLetter.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Surat tidak ditemukan' });
    }

    if (existing.status === 'VOID') {
      return res.status(400).json({ success: false, message: 'Surat ini sudah dibatalkan sebelumnya' });
    }

    const currentContent = existing.contentData || {};
    const updatedContent = {
      ...currentContent,
      voidMetadata: {
        voidedAt: new Date().toISOString(),
        voidedBy: req.member.name,
        voidedById: req.member.id,
        reason: voidReason || 'Dibatalkan oleh sekretaris/admin',
      },
    };

    const updated = await prisma.officialLetter.update({
      where: { id },
      data: {
        status: 'VOID',
        contentData: updatedContent,
      },
    });

    res.status(200).json({
      success: true,
      message: `Surat ${existing.letterNumber} berhasil dibatalkan (status VOID)`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/letters/verify/:letterNumber
 * Verifikasi publik (akses terbuka untuk scan QR Code surat)
 */
exports.verifyLetterPublic = async (req, res, next) => {
  try {
    const { letterNumber } = req.params;

    const letter = await prisma.officialLetter.findFirst({
      where: {
        OR: [
          { letterNumber: decodeURIComponent(letterNumber) },
          { id: letterNumber },
        ],
      },
      include: {
        createdBy: {
          select: { name: true, role: true },
        },
      },
    });

    if (!letter) {
      return res.status(404).json({
        valid: false,
        message: 'Nomor surat tidak terdaftar dalam arsip resmi FKHK.',
      });
    }

    res.status(200).json({
      valid: letter.status === 'ISSUED',
      status: letter.status,
      letterNumber: letter.letterNumber,
      subject: letter.subject,
      recipientName: letter.recipientName,
      recipientOrg: letter.recipientOrg,
      issuedAt: letter.issuedAt,
      scope: letter.scope,
      divisionCode: letter.divisionCode,
      committeeCode: letter.committeeCode,
      subjectName: SUBJECT_CODES[letter.subjectCode] || letter.subjectCode,
      issuedBy: letter.createdBy ? letter.createdBy.name : 'Sekretariat FKHK',
      isVoid: letter.status === 'VOID',
      voidMetadata: letter.contentData?.voidMetadata || null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/letters/stats
 * Ringkasan statistik persuratan tahun berjalan
 */
exports.getStats = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();

    const [totalYear, totalIssued, totalVoid, latestSeq] = await Promise.all([
      prisma.officialLetter.count({
        where: {
          issuedAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      }),
      prisma.officialLetter.count({
        where: {
          status: 'ISSUED',
          issuedAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      }),
      prisma.officialLetter.count({
        where: {
          status: 'VOID',
          issuedAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      }),
      prisma.letterSequence.findUnique({
        where: {
          year_scopeKey: {
            year: currentYear,
            scopeKey: 'GLOBAL',
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      currentYear,
      totalYear,
      totalIssued,
      totalVoid,
      currentSequence: latestSeq ? latestSeq.lastSeq : 0,
    });
  } catch (err) {
    next(err);
  }
};
