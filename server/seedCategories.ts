import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
  const categories = [
    { name: 'Haji & Umrah', code: 'A' },
    { name: 'Bimas Islam', code: 'B' },
    { name: 'Pendidikan Madrasah', code: 'C' },
    { name: 'Penyelenggara Zakat & Wakaf', code: 'D' },
    { name: 'Kepegawaian', code: 'E' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: {},
      create: {
        name: cat.name,
        code: cat.code
      }
    });
  }

  console.log('Seed completed. Categories created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
