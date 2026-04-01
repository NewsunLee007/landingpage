import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'newsun2024';

    const existingAdmin = await prisma.adminUser.findUnique({
      where: { username: adminUsername },
    });

    if (existingAdmin) {
      return res.json({ message: `Admin user '${adminUsername}' already exists` });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });

    res.json({ message: `Admin user '${adminUsername}' created successfully` });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
