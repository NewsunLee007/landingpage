import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 创建article表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "article" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "imageUrl" TEXT,
        "tags" TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "article_pkey" PRIMARY KEY ("id")
      );
    `;

    // 创建app_item表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "app_item" (
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
        CONSTRAINT "app_item_pkey" PRIMARY KEY ("id")
      );
    `;

    // 创建admin_user表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "admin_user" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "admin_user_pkey" PRIMARY KEY ("id")
      );
    `;

    // 创建唯一索引
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "admin_user_username_key" ON "admin_user"("username");
    `;

    // 创建comment表
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "comment" (
        "id" TEXT NOT NULL,
        "articleId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "email" TEXT,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "likes" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
      );
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
