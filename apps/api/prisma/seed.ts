import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// Importă din clientul generat (folosește calea ta corectă)
import { PrismaClient, Role } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const viewerPasswordHash = await bcrypt.hash('Viewer123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@projectops.dev' },
    update: {},
    create: {
      email: 'admin@projectops.dev',
      name: 'Admin',
      role: Role.admin,
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@projectops.dev' },
    update: {},
    create: {
      email: 'viewer@projectops.dev',
      name: 'Viewer',
      role: Role.viewer,
      passwordHash: viewerPasswordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
