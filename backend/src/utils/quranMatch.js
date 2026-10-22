// Mengganti ayat Al-Qur'an hasil ekstrak PDF dengan teks standar Kemenag.
//
// Lapisan teks Arab di PDF tidak bisa dipercaya: tergantung font, harakat bisa
// tertukar posisi, kata terpecah spasi, ligatur "Allah" teracak. Kerangka hurufnya
// (tanpa harakat dan spasi) jauh lebih stabil, jadi kerangka itu dicocokkan ke
// seluruh mushaf, lalu potongan yang cocok diganti teks aslinya.
//
// Data: src/data/quran-kemenag.json, dari github.com/rioastamal/quran-json
// (MIT, © 2018 Rio Astamal), sumber teks quran.kemenag.go.id.

const MIN_SKELETON = 12; // kutipan lebih pendek terlalu ambigu
const MAX_DISTANCE = 0.15; // toleransi huruf beda/hilang hasil PDF
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// Huruf dasar ternormalisasi; selain huruf (harakat, tanda waqaf, spasi, angka) dibuang
function skeletonChar(c) {
  const code = c.charCodeAt(0);
  if (code < 0x0621 || code > 0x06ff) return '';
  if ('أإآٱا'.includes(c)) return 'ا';
  if ('ىيئۦ'.includes(c)) return 'ي';
  if (c === 'ؤ') return 'و';
  if (c === 'ة') return 'ه';
  if (c === 'ء' || c === 'ـ') return '';
  if ((code >= 0x0621 && code <= 0x064a) || (code >= 0x0671 && code <= 0x06d3)) return c;
  return '';
}

// Kerangka + posisi tiap huruf kerangka di teks asal
function skeleton(text) {
  let sk = '';
  const pos = [];
  for (let i = 0; i < text.length; i++) {
    const s = skeletonChar(text[i]);
    if (s) {
      sk += s;
      pos.push(i);
    }
  }
  return { sk, pos };
}

let index = null;
function loadIndex() {
  if (index) return index;
  const surahs = require('../data/quran-kemenag.json');
  // Satu string untuk seluruh mushaf; tiap surah dipisah '|' agar kutipan tidak melintasi surah
  let all = '';
  const verses = []; // { surah, ayah, start, end, text, pos }
  surahs.forEach((s, si) => {
    s.a.forEach((text, ai) => {
      const { sk, pos } = skeleton(text);
      verses.push({ surah: si + 1, ayah: ai + 1, name: s.n, start: all.length, end: all.length + sk.length, text, pos });
      all += sk;
    });
    all += '|';
  });
  index = { all, verses };
  return index;
}

function verseAt(verses, offset) {
  let lo = 0;
  let hi = verses.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (verses[mid].start <= offset) lo = mid;
    else hi = mid - 1;
  }
  return verses[lo];
}

// Cari posisi kutipan: persis dulu, kalau tidak ada pakai voting potongan 6 huruf
// lalu penyelarasan (fitting alignment) dengan toleransi MAX_DISTANCE.
function locate(all, s) {
  const exact = all.indexOf(s);
  if (exact >= 0) return { start: exact, end: exact + s.length };

  const votes = new Map();
  const K = 6;
  const step = Math.max(1, Math.floor((s.length - K) / 24));
  for (let off = 0; off + K <= s.length; off += step) {
    const gram = s.slice(off, off + K);
    let at = all.indexOf(gram);
    let hits = 0;
    while (at >= 0 && hits < 50) {
      const key = Math.round((at - off) / 4); // toleransi geser beberapa huruf
      votes.set(key, (votes.get(key) || 0) + 1);
      at = all.indexOf(gram, at + 1);
      hits++;
    }
  }
  let best = null;
  for (const [key, n] of votes) if (!best || n > best.n) best = { key, n };
  if (!best || best.n < 3) return null;

  const slack = Math.ceil(s.length * MAX_DISTANCE) + 8;
  const from = Math.max(0, best.key * 4 - slack);
  const region = all.slice(from, best.key * 4 + s.length + slack);

  // DP: baris pertama 0 (awal bebas), simpan titik awal tiap sel
  const m = region.length;
  let prev = new Array(m + 1).fill(0);
  let prevStart = Array.from({ length: m + 1 }, (_, j) => j);
  for (let i = 1; i <= s.length; i++) {
    const cur = new Array(m + 1);
    const curStart = new Array(m + 1);
    cur[0] = i;
    curStart[0] = 0;
    for (let j = 1; j <= m; j++) {
      const sub = prev[j - 1] + (s[i - 1] === region[j - 1] ? 0 : 1);
      const del = prev[j] + 1;
      const ins = cur[j - 1] + 1;
      if (sub <= del && sub <= ins) {
        cur[j] = sub;
        curStart[j] = prevStart[j - 1];
      } else if (del <= ins) {
        cur[j] = del;
        curStart[j] = prevStart[j];
      } else {
        cur[j] = ins;
        curStart[j] = curStart[j - 1];
      }
    }
    prev = cur;
    prevStart = curStart;
  }
  let endJ = 0;
  for (let j = 1; j <= m; j++) if (prev[j] < prev[endJ]) endJ = j;
  if (prev[endJ] / s.length > MAX_DISTANCE) return null;
  const start = from + prevStart[endJ];
  const end = from + endJ;
  if (all.slice(start, end).includes('|')) return null;
  return { start, end };
}

const toArabicNumber = (n) => String(n).replace(/\d/g, (d) => ARABIC_DIGITS[d]);

// Potong teks ayat pada batas kata yang menutupi huruf kerangka [from, to)
function sliceVerse(v, from, to) {
  if (from <= 0 && to >= v.pos.length) return v.text;
  let a = v.pos[Math.max(0, from)];
  let b = v.pos[Math.min(v.pos.length, to) - 1] + 1;
  while (a > 0 && v.text[a - 1] !== ' ') a--;
  while (b < v.text.length && v.text[b] !== ' ') b++;
  return v.text.slice(a, b).trim();
}

/**
 * Cocokkan satu paragraf Arab ke mushaf.
 * Hasil: { text, ref } jika cocok (ref mis. "QS Al-Hujurat: 13"), atau null.
 */
function matchQuran(paragraph) {
  const { sk } = skeleton(paragraph);
  if (sk.length < MIN_SKELETON) return null;
  const { all, verses } = loadIndex();
  const hit = locate(all, sk);
  if (!hit) return null;

  const first = verseAt(verses, hit.start);
  const last = verseAt(verses, hit.end - 1);
  const withMarkers = paragraph.includes('۝');
  const parts = [];
  for (let i = verses.indexOf(first); i <= verses.indexOf(last); i++) {
    const v = verses[i];
    const from = hit.start - v.start;
    const to = hit.end - v.start;
    let piece = sliceVerse(v, from, to);
    // Nomor ayat hanya untuk ayat yang dikutip sampai akhir, sesuai gaya teks asal
    if (withMarkers && to >= v.end - v.start) piece += ` ۝${toArabicNumber(v.ayah)}`;
    parts.push(piece);
  }
  const ref =
    first === last
      ? `QS ${first.name}: ${first.ayah}`
      : `QS ${first.name}: ${first.ayah}–${last.ayah}`;
  return { text: parts.join(' '), ref };
}

const isArabicParagraph = (p) =>
  (p.match(/[؀-ۿ]/g) || []).length > (p.match(/[A-Za-z]/g) || []).length * 2;

/**
 * Ganti setiap ayat Al-Qur'an di isi artikel (paragraf dipisah baris kosong) dengan
 * teks standar. Paragraf Arab yang berurutan dicoba sebagai satu kutipan dulu,
 * karena PDF sering memecah satu ayat ke beberapa paragraf.
 * Hasil: { content, refs: ["QS ...", ...], unmatched: jumlah paragraf Arab yang bukan ayat }
 */
function restoreQuranInContent(content) {
  const paragraphs = content.split(/\n{2,}/);
  const out = [];
  const refs = [];
  let unmatched = 0;
  for (let i = 0; i < paragraphs.length; ) {
    if (!isArabicParagraph(paragraphs[i])) {
      out.push(paragraphs[i++]);
      continue;
    }
    let j = i;
    while (j < paragraphs.length && isArabicParagraph(paragraphs[j])) j++;
    const group = paragraphs.slice(i, j);
    const whole = matchQuran(group.join(' '));
    if (whole) {
      out.push(whole.text);
      refs.push(whole.ref);
    } else {
      for (const p of group) {
        const m = matchQuran(p);
        if (m) refs.push(m.ref);
        else unmatched++;
        out.push(m ? m.text : p);
      }
    }
    i = j;
  }
  return { content: out.join('\n\n'), refs: [...new Set(refs)], unmatched };
}

module.exports = { matchQuran, restoreQuranInContent };
