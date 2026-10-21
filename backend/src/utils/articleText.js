// Merapikan teks hasil ekstrak Word/PDF dan memisahkan daftar pustaka.
//
// Hasil: { title, byline, content, references }
//   - content: paragraf dipisah satu baris kosong
//   - references: satu entri per baris (kosong jika tidak ada daftar pustaka)
//   - title: judul di awal dokumen jika terdeteksi
//   - byline: nama setelah "Oleh:" / "Penulis:" di kepala dokumen

const REF_HEADING =
  /^(?:[IVXLC]+\.|\d+\.|[A-Z]\.)?\s*(daftar\s+pustaka|daftar\s+referensi|daftar\s+rujukan|referensi|rujukan|bibliografi|kepustakaan|sumber\s+rujukan|sumber\s+referensi|references|bibliography|works\s+cited)\s*:?$/i;

const ENTRY_START =
  /^(?:\[\d+\]|\d{1,3}[.)]\s|[-•*–]\s|[A-Z][A-Za-z'’\-]+,\s|[A-Z][A-Za-z'’\-]+\s[A-Z][A-Za-z'’\-]+,\s|https?:\/\/)/;

const SENTENCE_END = /[.!?:;"”'’)\]]$/;

const BYLINE = /^(?:oleh|penulis|ditulis\s+oleh|by|written\s+by)\s*:?\s+/i;

const isAllCaps = (line) => /[A-Z]/.test(line) && line === line.toUpperCase() && line.length <= 200;

// Kata tugas yang tetap huruf kecil di tengah judul (EYD)
const SMALL_WORDS = new Set([
  'dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'dalam', 'atau', 'pada', 'dengan', 'antara',
  'terhadap', 'sebagai', 'oleh', 'tentang', 'bagi', 'akan', 'atas', 'serta', 'para', 'si',
  'sang', 'kepada', 'menurut', 'tanpa', 'hingga', 'sampai', 'per', 'tetapi', 'namun', 'agar',
  'karena', 'secara', 'melalui', 'versus', 'vs', 'the', 'of', 'and', 'in', 'on', 'for', 'to', 'a', 'an',
]);

// Singkatan yang tetap kapital
const ACRONYMS = new Set([
  'FKHK', 'UIN', 'IAIN', 'STAIN', 'KHI', 'UU', 'UUD', 'UUP', 'PP', 'PERMA', 'SEMA', 'KUHP',
  'KUHAP', 'KDRT', 'PA', 'MA', 'MK', 'MUI', 'HAM', 'DPR', 'MPR', 'BPS', 'KPAI', 'PBB', 'RI',
  'NKRI', 'KB', 'KUA', 'BKKBN', 'LGBT', 'LGBTQ', 'AI', 'ITE', 'BPJS', 'SDGS', 'CEDAW', 'UNICEF',
  'WHO', 'PKK', 'TPKS', 'PPPA', 'KEMENPPPA', 'LBH', 'NU', 'PBNU', 'PTA', 'PN', 'HKI', 'HTN',
  'SAW', 'SWT', 'AS', 'RA', 'COVID',
]);
const ROMAN = /^(?=[IVXLC]+$)M{0,3}(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/;

// "KELUARGA BERENCANA DAN KEADILAN GENDER" -> "Keluarga Berencana dan Keadilan Gender"
function toTitleCase(title) {
  let startOfClause = true;
  return title
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token) || !token) return token;
      const m = token.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/);
      const [, pre, core, post] = m;
      let out;
      if (!core) out = token;
      else {
        const parts = core.split('-').map((part, idx) => {
          const bare = part.replace(/[^A-Za-z]/g, '');
          if (ACRONYMS.has(bare) || (ROMAN.test(bare) && bare.length > 0 && !/^(DI|MI|LI|DC)$/.test(bare)) || /\d/.test(part)) {
            return part;
          }
          const lower = part.toLowerCase();
          if (idx === 0 && !startOfClause && SMALL_WORDS.has(lower) && !/[(“"]/.test(pre)) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        });
        out = pre + parts.join('-') + post;
      }
      startOfClause = /[:.?!—–]$/.test(token);
      return out;
    })
    .join('');
}

function normalize(raw) {
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(/\f/g, '\n\n')
    .replace(/­/g, '') // soft hyphen
    .replace(/[   \t]/g, ' ')
    .replace(/[​-‍﻿]/g, '')
    .split('\n')
    .map((l) => l.replace(/ {2,}/g, ' ').trim())
    .join('\n');
}

// Baris sampah dari PDF: nomor halaman ("12", "- 12 -", "Halaman 3", "3 of 10")
function isNoise(line) {
  return (
    /^[-–—\s]*\d{1,4}[-–—\s]*$/.test(line) ||
    /^(halaman|hal\.?|page)\s*\d+(\s*(dari|of)\s*\d+)?$/i.test(line) ||
    /^\d+\s*(dari|of)\s*\d+$/i.test(line)
  );
}

// Sambung dua potongan baris; tangani pemenggalan kata di akhir baris.
function joinLine(prev, next) {
  const m = prev.match(/(\S+)-$/);
  if (m) {
    const before = m[1].toLowerCase();
    const after = (next.match(/^\S+/) || [''])[0].toLowerCase().replace(/[^a-zÀ-ɏ]/g, '');
    // Reduplikasi (anak-anak) tetap pakai tanda hubung, pemenggalan biasa (perem-puan) disatukan
    if (after && (after === before || after.startsWith(before) || /^[A-Z]/.test(next))) return prev + next;
    return prev.slice(0, -1) + next;
  }
  return `${prev} ${next}`;
}

// Kelompokkan baris menjadi paragraf. Dokumen Word sudah punya baris kosong
// antar paragraf; PDF memotong per baris sehingga perlu ditebak.
function toParagraphs(text) {
  const blocks = text.split(/\n{2,}/).map((b) => b.split('\n').filter((l) => l && !isNoise(l)));
  const lines = blocks.flat();
  const lengths = lines.map((l) => l.length).sort((a, b) => a - b);
  const typical = lengths.length ? lengths[Math.floor(lengths.length * 0.75)] : 0;
  const isWrapped = typical >= 50; // baris panjang seragam = hasil wrap PDF

  const paragraphs = [];
  for (const block of blocks) {
    if (!block.length) continue;
    if (!isWrapped || block.length === 1) {
      // Satu baris = satu paragraf (Word / txt)
      if (isWrapped) paragraphs.push(block[0]);
      else paragraphs.push(...block);
      continue;
    }
    let cur = '';
    let last = '';
    for (const line of block) {
      if (cur) {
        // Baris fisik sebelumnya pendek = paragraf/judul bagian selesai
        const lastShort = last.length < typical * 0.8;
        const endsSentence = SENTENCE_END.test(last);
        const looksHeading = !endsSentence && !/,$/.test(last) && /^[A-Z0-9]/.test(line);
        if (lastShort && (endsSentence || looksHeading)) {
          paragraphs.push(cur);
          cur = line;
        } else {
          cur = joinLine(cur, line);
        }
      } else {
        cur = line;
      }
      last = line;
    }
    if (cur) paragraphs.push(cur);
  }
  return paragraphs.map((p) => p.replace(/ {2,}/g, ' ').trim()).filter(Boolean);
}

// Pecah blok daftar pustaka menjadi satu entri per baris
function toReferenceEntries(lines) {
  const entries = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || isNoise(line)) continue;
    const prev = entries[entries.length - 1];
    const startsNew =
      !prev ||
      ENTRY_START.test(line) && !/^https?:\/\//.test(line) ||
      (SENTENCE_END.test(prev) && /^[A-Z]/.test(line) && !/^https?:\/\//.test(line) && prev.length > 30);
    // Sisa URL yang terpotong baris disambung tanpa spasi
    const urlContinues = /https?:\/\/\S*$/.test(prev) && !/\s/.test(line) && !/[.)]$/.test(prev);
    if (startsNew) entries.push(line);
    else if (urlContinues) entries[entries.length - 1] = prev + line;
    else entries[entries.length - 1] = /^https?:\/\//.test(line) ? `${prev} ${line}` : joinLine(prev, line);
  }
  return entries.map((e) => e.replace(/ {2,}/g, ' ').replace(/^[-•*–]\s+/, '').trim()).filter(Boolean);
}

function tidyArticleText(raw) {
  const text = normalize(raw || '');
  const allLines = text.split('\n');

  // Cari judul bagian daftar pustaka terakhir di dokumen
  let refIdx = -1;
  for (let i = allLines.length - 1; i >= 0; i--) {
    if (REF_HEADING.test(allLines[i])) {
      refIdx = i;
      break;
    }
  }

  const bodyLines = refIdx >= 0 ? allLines.slice(0, refIdx) : allLines;
  const references = refIdx >= 0 ? toReferenceEntries(allLines.slice(refIdx + 1)) : [];

  // Kepala dokumen: judul (bisa terbagi beberapa baris di PDF) dan baris "Oleh: ..."
  const head = [];
  for (let i = 0; i < bodyLines.length && head.length < 8; i++) {
    if (bodyLines[i] && !isNoise(bodyLines[i])) head.push(i);
  }
  let title = '';
  let byline = '';
  const drop = new Set();
  const bylineAt = head.findIndex((i) => BYLINE.test(bodyLines[i]));
  if (bylineAt >= 0) {
    byline = bodyLines[head[bylineAt]].replace(BYLINE, '').trim();
    drop.add(head[bylineAt]);
    const before = head.slice(0, bylineAt);
    if (before.length && before.length <= 4 && before.every((i) => !/[.!?]$/.test(bodyLines[i]))) {
      title = before.map((i) => bodyLines[i]).join(' ');
      before.forEach((i) => drop.add(i));
    }
  }
  if (!title) {
    const caps = [];
    for (const i of head) {
      if (!isAllCaps(bodyLines[i]) || caps.length >= 4) break;
      caps.push(i);
    }
    if (caps.length && caps.length < head.length) {
      title = caps.map((i) => bodyLines[i]).join(' ');
      caps.forEach((i) => drop.add(i));
    }
  }

  const paragraphs = toParagraphs(bodyLines.filter((_, i) => !drop.has(i)).join('\n'));

  // Tanpa judul kapital/byline: paragraf pertama yang pendek dan tidak diakhiri titik
  if (!title && paragraphs.length > 1 && paragraphs[0].length <= 200 && !/[.!?:]$/.test(paragraphs[0])) {
    title = paragraphs.shift();
  }

  title = title.replace(/ {2,}/g, ' ').trim();
  if (isAllCaps(title) && /[A-Z]{2}/.test(title)) title = toTitleCase(title);

  return {
    title,
    byline,
    content: paragraphs.join('\n\n'),
    references: references.join('\n'),
  };
}

module.exports = { tidyArticleText, toTitleCase };
