/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import {
  PrismaClient,
  Role,
  ProjectRole,
  ProjectStatus,
} from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function upsertUser(params: {
  email: string;
  name: string;
  role: Role;
  passwordPlain: string;
}) {
  const passwordHash = await bcrypt.hash(params.passwordPlain, 10);

  return prisma.user.upsert({
    where: { email: params.email },
    update: {
      name: params.name,
      role: params.role,
    },
    create: {
      email: params.email,
      name: params.name,
      role: params.role,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

async function getOrCreateProject(params: {
  ownerId: string;
  name: string;
  status?: ProjectStatus;
}) {
  const existing = await prisma.project.findFirst({
    where: { ownerId: params.ownerId, name: params.name },
    select: { id: true, name: true, ownerId: true, status: true },
  });

  if (existing) return existing;

  return prisma.project.create({
    data: {
      ownerId: params.ownerId,
      name: params.name,
      status: params.status ?? ProjectStatus.active,
    },
    select: { id: true, name: true, ownerId: true, status: true },
  });
}

type MembershipRow = { projectId: string; userId: string; role: ProjectRole };

async function upsertMembership(params: {
  projectId: string;
  userId: string;
  role: ProjectRole;
}): Promise<MembershipRow> {
  const row = await prisma.projectMember.upsert({
    where: {
      projectId_userId: { projectId: params.projectId, userId: params.userId },
    },
    update: { role: params.role },
    create: {
      projectId: params.projectId,
      userId: params.userId,
      role: params.role,
    },
    select: { projectId: true, userId: true, role: true },
  });

  return row;
}

async function main() {
  const admin = await upsertUser({
    email: 'admin@projectops.dev',
    name: 'Admin',
    role: Role.admin,
    passwordPlain: 'Admin123!',
  });

  const viewer = await upsertUser({
    email: 'viewer@projectops.dev',
    name: 'Viewer',
    role: Role.viewer,
    passwordPlain: 'Viewer123!',
  });

  const adminProject = await getOrCreateProject({
    ownerId: admin.id,
    name: 'Admin Workspace',
    status: ProjectStatus.active,
  });

  const viewerProject = await getOrCreateProject({
    ownerId: viewer.id,
    name: 'Viewer Sandbox',
    status: ProjectStatus.active,
  });

  await upsertMembership({
    projectId: adminProject.id,
    userId: admin.id,
    role: ProjectRole.owner,
  });

  await upsertMembership({
    projectId: adminProject.id,
    userId: viewer.id,
    role: ProjectRole.member,
  });

  await upsertMembership({
    projectId: viewerProject.id,
    userId: viewer.id,
    role: ProjectRole.owner,
  });

  await upsertMembership({
    projectId: viewerProject.id,
    userId: admin.id,
    role: ProjectRole.admin,
  });

  console.log('Seed complete');
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
