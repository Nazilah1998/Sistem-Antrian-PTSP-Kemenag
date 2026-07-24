import 'dotenv/config';
import { db } from './index';
import { categories, users } from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database under kemenag_loket schema...');

  // Ensure default categories exist
  const defaultCategories = [
    { name: 'Seksi Penyelenggaraan Haji & Umrah (PHU)', code: 'A' },
    { name: 'Seksi Bimas Islam & Zakat/Wakaf', code: 'B' },
    { name: 'Seksi Pendidikan Islam (Pendis)', code: 'C' },
    { name: 'Subbag TU & Layanan Umum/PTSP', code: 'D' },
  ];

  for (const cat of defaultCategories) {
    const existing = await db.select().from(categories).where(eq(categories.code, cat.code));
    if (existing.length === 0) {
      await db.insert(categories).values(cat);
      console.log(`+ Category added: [${cat.code}] ${cat.name}`);
    }
  }

  // Clear all existing users first to ensure strictly 1 account
  await db.delete(users);

  // Insert ONLY 1 Administrator PTSP account
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.insert(users).values({
    username: 'admin',
    password: hashedPassword,
    role: 'ADMIN',
    name: 'Administrator PTSP',
  });

  console.log('+ Strictly 1 user active: admin (password: admin123)');
  console.log('✅ Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
