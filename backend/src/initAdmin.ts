import bcrypt from 'bcrypt';
import { prisma } from './prisma.js';
import { logger } from './utils/logger.js';

export const initAdmin = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'newsun2024';

    logger.info('Checking for existing admin user', { username: adminUsername });

    const existingAdmin = await prisma.adminUser.findUnique({
      where: { username: adminUsername },
    });

    if (existingAdmin) {
      logger.info(`Admin user '${adminUsername}' already exists`);
      return;
    }

    logger.info('Creating new admin user', { username: adminUsername });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });

    logger.info(`Admin user '${adminUsername}' created successfully`);
  } catch (error) {
    logger.error('Error initializing admin user', error);
    throw error;
  }
};
