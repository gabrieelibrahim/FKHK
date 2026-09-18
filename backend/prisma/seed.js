const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.member.upsert({
    where: { email: 'admin@fkhk.id' },
    update: {},
    create: {
      email: 'admin@fkhk.id',
      passwordHash: adminPassword,
      name: 'Admin FKHK',
      affiliation: 'FKHK',
      role: 'admin',
      isActive: true,
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Create sample members
  const members = [
    { email: 'ela@fkhk.id', name: 'Ela Nur Hidayati', affiliation: 'UIN Sunan Kalijaga' },
    { email: 'riziq@fkhk.id', name: 'M. Riziq Fauzi', affiliation: 'UIN Sunan Kalijaga' },
    { email: 'najma@fkhk.id', name: 'Najma Ulya I.', affiliation: 'UIN Sunan Kalijaga' },
  ];

  for (const m of members) {
    const pwd = await bcrypt.hash('member123', 10);
    await prisma.member.upsert({
      where: { email: m.email },
      update: {},
      create: { ...m, passwordHash: pwd, role: 'member' },
    });
  }
  console.log(`Members created: ${members.length}`);

  // Create sample articles
  const articles = [
    { title: 'Pola Pengasuhan Anak dalam Perspektif Hukum Islam', slug: 'pola-pengasuhan-anak', content: 'Kajian tentang bagaimana hukum Islam memandang kewajiban orang tua dalam proses pengasuhan anak, serta batasan-batasan yang harus diperhatikan demi terwujudnya keluarga yang harmonis dan berkeadilan.', excerpt: 'Kajian tentang kewajiban orang tua dalam pengasuhan anak perspektif hukum Islam.', topic: 'Parenting & Keluarga', tags: ['parenting', 'hukum-keluarga'], authorEmail: 'ela@fkhk.id', isFeatured: true },
    { title: 'Dispensasi Perkawinan: Dilema Perlindungan Anak dan Kepastian Hukum', slug: 'dispensasi-perkawinan', content: 'Analisis yuridis terhadap praktik dispensasi perkawinan anak di pengadilan dan implikasinya bagi perlindungan hak-hak anak.', excerpt: 'Analisis yuridis dispensasi perkawinan anak.', topic: 'Pernikahan', tags: ['pernikahan', 'perlindungan-anak'], authorEmail: 'riziq@fkhk.id', isFeatured: true },
    { title: 'Analisis Putusan Hakim dalam Sengketa Hak Asuh Anak Pasca Perceraian', slug: 'analisis-putusan-hakim-asuh', content: 'Studi komparatif terhadap pertimbangan hukum hakim dalam memutus perkara hak asuh anak di beberapa pengadilan agama.', excerpt: 'Studi komparatif putusan hakim dalam sengketa hak asuh anak.', topic: 'Studi Putusan', tags: ['hak-asuh', 'perceraian'], authorEmail: 'najma@fkhk.id', isFeatured: true },
  ];

  for (const a of articles) {
    const author = await prisma.member.findUnique({ where: { email: a.authorEmail } });
    if (!author) continue;
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        title: a.title,
        slug: a.slug,
        content: a.content,
        excerpt: a.excerpt,
        topic: a.topic,
        tags: a.tags,
        authorId: author.id,
        status: 'published',
        isFeatured: a.isFeatured,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`Articles created: ${articles.length}`);

  // Create sample events
  const events = [
    { title: 'Seminar Nasional: Reformasi Hukum Keluarga di Era Modern', slug: 'seminar-nasional-reformasi', description: 'Seminar nasional dengan pembicara dari berbagai universitas ternama. Membahas isu-isu terkini reformasi hukum keluarga.', dateTime: new Date('2026-08-20T09:00:00'), location: 'Aula Kampus, Gedung A Lt. 3', capacity: 150, status: 'upcoming' },
    { title: 'Diskusi Bulanan: Problematika Wali Nikah', slug: 'diskusi-bulanan-wali-nikah', description: 'Diskusi rutin bulanan FKHK membahas problematika wali nikah dalam kasus kontemporer.', dateTime: new Date('2026-06-15T14:00:00'), location: 'Ruang Diskusi FKHK', capacity: 50, status: 'completed' },
    { title: 'Workshop Penulisan Karya Ilmiah', slug: 'workshop-penulisan-ilmiah', description: 'Workshop penulisan karya ilmiah untuk jurnal terakreditasi.', dateTime: new Date('2026-06-03T09:00:00'), location: 'Lab Komputer Fakultas', capacity: 30, status: 'completed' },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: { ...e, createdById: admin.id },
    });
  }
  console.log(`Events created: ${events.length}`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
