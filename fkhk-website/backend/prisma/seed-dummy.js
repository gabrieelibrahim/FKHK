// seed-dummy.js — Populate FKHK with realistic dummy data
// Run inside backend container: node prisma/seed-dummy.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');

// --- Data pools ---
const firstNames = ['Ahmad','Siti','Muhammad','Fatimah','Abdul','Aisyah','Ibrahim','Khadijah','Yusuf','Zainab','Umar','Maryam','Ali','Hafsah','Hasan','Ruqayyah','Hamzah','Sumayyah','Zaid','Asma'];
const lastNames = ['Pratama','Wijaya','Santoso','Hidayat','Maulana','Rahman','Putri','Fauzi','Lestari','Gunawan','Saputra','Anggraini','Kurniawan','Wati','Nugroho','Safitri','Hakim','Yuliana','Ramadhan','Aulia'];
const affiliations = ['UIN Sunan Kalijaga','UGM','UI','UNPAD','UNAIR','UNY','UMY','UIN Syarif Hidayatullah','IAIN Surakarta','STAIN Parepare','Universitas Diponegoro','Universitas Brawijaya'];

const articleData = [
  { title: 'Wali Hakim dalam Penetapan Nafkah Anak Pasca Perceraian', topic: 'Nafkah', tags: ['nafkah','perceraian','anak'], excerpt: 'Analisis kewenangan wali hakim dalam menetapkan besaran nafkah anak pasca perceraian orang tua.' },
  { title: 'Pewaris Menurut Kompilasi Hukum Islam: Studi Komparatif Faraid', topic: 'Waris', tags: ['waris','faraid','kompilasi'], excerpt: 'Kajian komparatif sistem pewaris dalam KHI dengan fiqh faraid klasik.' },
  { title: 'Perlindungan Hukum terhadap Istri dalam Poligami Semi-Aurat', topic: 'Poligami', tags: ['poligami','perlindungan-istri'], excerpt: 'Menakar efektivitas perlindungan hukum bagi istri dalam praktik poligami di luar pengadilan.' },
  { title: 'Asas Monogami dalam UU Perkawinan: Antara Norma dan Realitas', topic: 'Pernikahan', tags: ['monogami','uu-perkawinan'], excerpt: 'Tinjauan yuridis atas asas monogami dan pengecualiannya dalam UU No. 1/1974.' },
  { title: 'Dispensasi Kawin: Urgensi Pembatasan Usia Minimal Perkawinan', topic: 'Pernikahan', tags: ['dispensasi','usia-minimal','anak'], excerpt: 'Studi kritis atas praktik dispensasi kawin dan implikasinya terhadap perlindungan anak.' },
  { title: 'Hibah Fasid: Mekanisme Pencegahan Kecurangan dalam Pembagian Waris', topic: 'Waris', tags: ['hibah','waris','kecurangan'], excerpt: 'Mekanisme hibah fasad sebagai upaya pencegahan kecurangan dalam pembagian waris.' },
  { title: 'Talak Cerai: Prosedur dan Konsekuensi Hukumnya', topic: 'Perceraian', tags: ['talak','cerai','pengadilan'], excerpt: 'Telaah prosedur talak cerai di pengadilan agama dan konsekuensi hukumnya.' },
  { title: 'Hak Hadhanah: Kajian Komparatif Hukum Islam dan Hukum Nasional', topic: 'Parenting & Keluarga', tags: ['hadhanah','hukum-islam','hukum-nasional'], excerpt: 'Perbandingan hak hadhanah dalam hukum Islam dan hukum nasional Indonesia.' },
  { title: 'Nikah Siri dalam Perspektif Hukum Positif dan Hukum Islam', topic: 'Pernikahan', tags: ['nikah-siri','hukum-positif'], excerpt: 'Analisis dualitas nikah siri dalam hukum positif dan hukum Islam.' },
  { title: 'Harta Bersama dalam Perceraian: Prinsip Pemisahan dan Pembagian', topic: 'Harta Bersama', tags: ['harta-bersama','perceraian','pembagian'], excerpt: 'Prinsip pemisahan dan pembagian harta bersama (gono-gini) saat perceraian.' },
  { title: 'Isteri Sebagai Ahli Waris: Analisis 2:1 dalam KHI', topic: 'Waris', tags: ['istri','waris','khi'], excerpt: 'Analisis pembagian waris istri dengan rasio 2:1 dalam Kompilasi Hukum Islam.' },
  { title: 'Pencatatan Perkawinan: Antara Administrasi Negara dan Validitas Syariat', topic: 'Pernikahan', tags: ['pencatatan','administrasi','syariat'], excerpt: 'Tinjauan atas fungsi pencatatan perkawinan dalam administrasi negara dan validitas syariat.' },
  { title: 'Kekerasan Dalam Rumah Tangga: Tinjauan Hukum Islam dan UU PKDRT', topic: 'KDRT', tags: ['kdrt','pkdrt','perlindungan'], excerpt: 'Tinjauan komparatif kekerasan dalam rumah tangga berdasarkan hukum Islam dan UU PKDRT.' },
  { title: 'Wasiat Wajibah bagi Anak Angkat dan Anak di Luar Nikah', topic: 'Waris', tags: ['wasiat-wajibah','anak-angkat','anak-luar-nikah'], excerpt: 'Analisis mekanisme wasiat wajibah sebagai solusi waris bagi anak angkat dan anak di luar nikah.' },
  { title: 'Prinsip Mafa Qabla al-Darak dalam Gugatan Cerai', topic: 'Perceraian', tags: ['gugatan','cerai','uslub'], excerpt: 'Kajian atas prinsip "mafa qabla al-darak" sebagai pertimbangan hakim dalam gugatan cerai.' }
];

const eventData = [
  { title: 'Seminar Nasional: Reformasi Hukum Keluarga Indonesia', description: 'Membahas dinamika pembaruan hukum keluarga di Indonesia dari masa ke masa, dengan fokus pada isu kontemporer perlindungan anak dan perempuan dalam perkawinan.', location: 'Aula UIN Sunan Kalijaga, Yogyakarta', capacity: 200 },
  { title: 'Workshop Fiqh Munakahat untuk Mahasiswa Hukum', description: 'Pendalaman materi fiqh munakahat bagi mahasiswa fakultas hukum, mencakup rukun dan syarat perkawinan, pembatalan, serta konsep modernnya.', location: 'Zoom Webinar (Online)', onlineUrl: 'https://zoom.us/j/fkhk-workshop', capacity: 100 },
  { title: 'Diskusi Panel: Perlindungan Anak dalam Dispensasi Kawin', description: 'Forum diskusi mengkaji sisi perlindungan anak dalam praktik dispensasi kawin di Indonesia, melibatkan perspektif hakim, akademisi, dan aktivis anak.', location: 'Fakultas Hukum UGM, Yogyakarta', capacity: 150 },
  { title: 'Pelatihan Mediasi Penyelesaian Sengketa Keluarga', description: 'Pelatihan intensif teknik mediasi penyelesaian sengketa keluarga di luar pengadilan untuk praktisi hukum dan paralegal.', location: 'Hotel Mercure, Surabaya', capacity: 50 },
  { title: 'Bedah Buku: "Hukum Keluarga Islam di Indonesia"', description: 'Bedah buku karya Prof. Dr. Amir Syamsuddin yang membahas perkembangan hukum keluarga Islam di Indonesia dari era kompilasi hingga undang-undang terkini.', location: 'Perpustakaan Nasional, Jakarta', capacity: 300 },
  { title: 'Kuliah Umum: Perlindungan Perempuan dalam Hukum Keluarga', description: 'Kuliah umum oleh Dr. Huzaemah TG Abdullah mengenai upaya perlindungan perempuan dalam praktik hukum keluarga Islam dan nasional.', location: 'Auditorium UNAIR, Surabaya', capacity: 250 },
  { title: 'Lokakarya: Penyusunan Akta Perkawinan Digital', description: 'Lokakarya praktis penyusunan dan pengelolaan akta perkawinan digital, integrasi data ke KUA, dan tantangan administratif.', location: 'KUA Kapanewon Gamping, Sleman', capacity: 80 }
];

const commentSnippets = [
  'Artikel yang sangat informatif, terima kasih atas penjelasannya.',
  'Saya tertarik dengan pembahasan ini. Apakah ada referensi tambahan?',
  'Bagus, tapi saya kira perlu dikaji lebih dalam dari sisi sosial.',
  'Penjelasannya jelas, tapi contoh kasusnya kurang.',
  'Terima kasih pak, sangat membantu tugas kuliah saya.',
  'Saya setuju dengan analisisnya, terutama di bagian pembagian waris.',
  'Apakah pendapat ini juga berlaku untuk konteks adat?',
  'Mantap, nanti saya kutip di skripsi.',
  'Mohon koreksi, di bagian paragraf 3 ada salah ketik.',
  'Perspektifnya unik, saya belum pernah lihat kajian seperti ini.',
  'Ada rekomendasi buku untuk pendalaman topik ini?',
  'Artikelnya bermanfaat sekali, ditunggu kelanjutannya.'
];

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomChoiceMany(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomPhone() {
  return `08${randomInt(10,99)}-${randomInt(1000,9999)}-${randomInt(1000,9999)}`;
}

function generateBio(name, affiliation) {
  return `${name} adalah mahasiswa ${affiliation} yang aktif mengkaji isu hukum keluarga Islam. Tertarik pada bidang fiqh munakahat dan perlindungan anak dalam konteks hukum positif Indonesia.`;
}

function generateContent(title, excerpt, tags) {
  const intro = `${excerpt}\n\nPendahuluan\nPembahasan mengenai ${title.toLowerCase()} merupakan salah satu diskursus penting dalam kajian hukum keluarga Indonesia. Topik ini berkaitan erat dengan dinamika masyarakat dan tantangan kontemporer dalam penegakan hukum keluarga yang berkeadilan.\n\nPembahasan\nPara ahli hukum keluarga sepakat bahwa isu terkait ${tags.join(', ')} membutuhkan pendekatan komprehensif. Hukum positif Indonesia, khususnya KHI dan UU Perkawinan No. 1/1974, memberikan kerangka regulasi yang menjadi rujukan utama. Namun, praktik di lapangan menunjukkan adanya kesenjangan antara norma dan realitas sosial.\n\nDalam konteks ini, peran hakim, akademisi, dan praktisi hukum menjadi krusial. Putusan pengadilan seringkali menjadi rujukan penting untuk memahami implementasi norma dalam kasus konkret. Sementara itu, kajian akademik menyediakan landasan teoretis yang memperkaya analisis.\n\nKesimpulan\nBerdasarkan analisis yang telah dilakukan, dapat disimpulkan bahwa pemahaman komprehensif atas isu ini memerlukan integrasi pendekatan normatif, sosiologis, dan filosofis. Relevansi kajian ini terletak pada kontribusinya bagi pengembangan hukum keluarga yang responsif terhadap kebutuhan masyarakat.`;
  return intro;
}

async function main() {
  console.log('🌱 Starting FKHK dummy seed...');

  // --- 1. Create 15 members ---
  const members = [];
  for (let i = 0; i < 15; i++) {
    const name = `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}+${i}@mail.com`;
    const affiliation = randomChoice(affiliations);
    const passwordHash = await bcrypt.hash('member123', 10);

    const member = await prisma.member.create({
      data: {
        email,
        passwordHash,
        name,
        phone: randomPhone(),
        affiliation,
        bio: generateBio(name, affiliation),
        interests: randomChoiceMany(['waris','pernikahan','perceraian','hadhanah','nafkah','poligami','kdrt'], 3),
        role: 'member',
        isActive: true,
        createdAt: new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000)
      }
    });
    members.push(member);
    console.log(`  ✓ Member: ${member.name} (${member.email})`);
  }

  // --- 2. Create articles (assign to random members + existing authors) ---
  const allAuthors = [...members];
  // Include existing seeded authors (IDs 2,3,4 from initial seed)
  const existingAuthors = await prisma.member.findMany({ where: { id: { in: [2, 3, 4] } } });
  allAuthors.push(...existingAuthors);

  const articles = [];
  for (const data of articleData) {
    const author = randomChoice(allAuthors);
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const daysAgo = randomInt(1, 60);

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: slug + '-' + randomInt(100, 999),
        content: generateContent(data.title, data.excerpt, data.tags),
        excerpt: data.excerpt,
        authorId: author.id,
        topic: data.topic,
        tags: data.tags,
        status: 'published',
        viewCount: randomInt(15, 850),
        isFeatured: Math.random() > 0.6,
        publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      }
    });
    articles.push(article);
    console.log(`  ✓ Article: ${article.title}`);
  }

  // --- 3. Create events ---
  const events = [];
  for (const data of eventData) {
    const creator = randomChoice(allAuthors);
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const futureDate = new Date(Date.now() + randomInt(7, 90) * 24 * 60 * 60 * 1000);

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: slug + '-' + randomInt(100, 999),
        description: data.description,
        dateTime: futureDate,
        location: data.location,
        onlineUrl: data.onlineUrl || null,
        capacity: data.capacity,
        createdById: creator.id,
        status: 'upcoming',
        createdAt: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000)
      }
    });
    events.push(event);
    console.log(`  ✓ Event: ${event.title}`);
  }

  // --- 4. Create comments on articles ---
  for (const article of articles) {
    const commentCount = randomInt(2, 5);
    for (let i = 0; i < commentCount; i++) {
      const commenter = randomChoice(allAuthors);
      await prisma.comment.create({
        data: {
          articleId: article.id,
          memberId: commenter.id,
          content: randomChoice(commentSnippets),
          isApproved: Math.random() > 0.3,
          createdAt: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000)
        }
      });
    }
  }
  console.log(`  ✓ Comments: added to ${articles.length} articles`);

  // --- 5. Create event registrations ---
  for (const event of events) {
    const regCount = randomInt(5, Math.min(20, event.capacity || 15));
    const registrants = randomChoiceMany(allAuthors, regCount);
    for (const member of registrants) {
      try {
        await prisma.registration.create({
          data: {
            eventId: event.id,
            memberId: member.id,
            attended: false,
            registeredAt: new Date(Date.now() - randomInt(1, 14) * 24 * 60 * 60 * 1000)
          }
        });
      } catch (e) { /* unique constraint skip */ }
    }
  }
  console.log(`  ✓ Registrations: added to ${events.length} events`);

  // --- 6. Newsletter subscribers ---
  for (let i = 0; i < 8; i++) {
    const name = `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}+n${i}@gmail.com`;
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        interestedTopics: randomChoiceMany(['waris','pernikahan','perceraian','hadhanah','nafkah','poligami'], 2),
        isVerified: Math.random() > 0.4,
        subscribedAt: new Date(Date.now() - randomInt(1, 60) * 24 * 60 * 60 * 1000)
      }
    });
  }
  console.log(`  ✓ Newsletter: 8 subscribers`);

  // --- Summary ---
  const counts = await Promise.all([
    prisma.member.count(),
    prisma.article.count(),
    prisma.event.count(),
    prisma.comment.count(),
    prisma.registration.count(),
    prisma.newsletterSubscriber.count()
  ]);
  console.log('\n📊 Dummy Seed Complete!');
  console.log(`   Members:    ${counts[0]}`);
  console.log(`   Articles:   ${counts[1]}`);
  console.log(`   Events:     ${counts[2]}`);
  console.log(`   Comments:   ${counts[3]}`);
  console.log(`   Registrations: ${counts[4]}`);
  console.log(`   Newsletter: ${counts[5]}`);
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
