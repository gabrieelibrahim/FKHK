const ROMAN_MONTHS = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: 'XI',
  12: 'XII',
};

const SUBJECT_CODES = {
  '01': 'Keputusan (SK)',
  '02': 'Instruksi',
  '03': 'Permohonan',
  '04': 'Undangan',
  '05': 'Jawaban',
  '06': 'Ucapan',
  '07': 'Edaran',
  '08': 'Tugas',
  '09': 'Kuasa',
  '10': 'Keterangan',
  '11': 'Sertifikat',
};

const DIVISION_CODES = {
  KR: 'Kajian dan Riset',
  AD: 'Advokasi',
  PD: 'Pengembangan Sumber Daya Manusia (PSDM)',
  PR: 'Publikasi dan Relasi',
};

function getRomanMonth(month) {
  return ROMAN_MONTHS[month] || 'I';
}

function formatLetterNumber({ sequence, subjectCode, scope, divisionCode, committeeCode, date = new Date() }) {
  const d = date instanceof Date ? date : new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const romanMonth = getRomanMonth(month);
  const seqPadded = String(sequence).padStart(3, '0');
  const subjPadded = String(subjectCode).padStart(2, '0');

  let middlePart = '';
  if (scope === 'DIVISI' && divisionCode) {
    middlePart = `/${divisionCode.trim().toUpperCase()}`;
  } else if (scope === 'KEPANITIAAN' && committeeCode) {
    let cleanComm = committeeCode.trim().toUpperCase();
    if (!cleanComm.startsWith('PTA-')) {
      cleanComm = `PTA-${cleanComm}`;
    }
    middlePart = `/${cleanComm}`;
  }

  // Format: [Nomor_Urut]/[Kode_Perihal]/[Kode_Divisi_atau_Kepanitiaan]/FKHK/[Bulan_Romawi]/[Tahun]
  return `${seqPadded}/${subjPadded}${middlePart}/FKHK/${romanMonth}/${year}`;
}

/**
 * Preview next letter number without incrementing sequence
 */
async function previewNextNumber(prisma, { subjectCode, scope, divisionCode, committeeCode, date = new Date(), scopeKey = 'GLOBAL' }) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();

  const seqRecord = await prisma.letterSequence.findUnique({
    where: {
      year_scopeKey: {
        year,
        scopeKey,
      },
    },
  });

  const nextSeq = (seqRecord ? seqRecord.lastSeq : 0) + 1;
  const preview = formatLetterNumber({
    sequence: nextSeq,
    subjectCode,
    scope,
    divisionCode,
    committeeCode,
    date: d,
  });

  return {
    nextSequence: nextSeq,
    previewNumber: preview,
    year,
    scopeKey,
  };
}

module.exports = {
  ROMAN_MONTHS,
  SUBJECT_CODES,
  DIVISION_CODES,
  getRomanMonth,
  formatLetterNumber,
  previewNextNumber,
};
