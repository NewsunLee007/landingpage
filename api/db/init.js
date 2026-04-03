import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 创建Article表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Article" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "imageUrl" TEXT,
        "tags" TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
      );
    `;

    // 创建AppItem表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AppItem" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "tags" TEXT[],
        "iconName" TEXT NOT NULL,
        "imageUrl" TEXT,
        "isPrivate" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "AppItem_pkey" PRIMARY KEY ("id")
      );
    `;

    // 创建AdminUser表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AdminUser" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
      );
    `;

    // 创建唯一索引
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username");
    `;

    // 检查是否已存在admin用户
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      // 创建默认admin用户
      await prisma.adminUser.create({
        data: {
          id: 'admin-1',
          username: 'admin',
          password: 'newsun2024',
        }
      });
    }

    res.json({ 
      message: 'Database tables created successfully',
      tables: ['Article', 'AppItem', 'AdminUser']
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      message: 'Failed to initialize database',
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
