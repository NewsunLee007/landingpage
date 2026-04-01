import { PrismaClient } from '@prisma/client';

let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (prisma) {
        const articles = await prisma.article.findMany({
          orderBy: { date: 'desc' },
        });
        res.json(articles);
      } else {
        res.json([]);
      }
    } else if (req.method === 'POST') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const articleData = req.body;
      const newArticle = await prisma.article.create({
        data: articleData,
      });
      res.json(newArticle);
    } else if (req.method === 'PUT') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id, ...articleData } = req.body;
      const updatedArticle = await prisma.article.update({
        where: { id },
        data: articleData,
      });
      res.json(updatedArticle);
    } else if (req.method === 'DELETE') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id } = req.body;
      await prisma.article.delete({
        where: { id },
      });
      res.json({ message: 'Article deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Article API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (error) {
        console.error('Error disconnecting Prisma:', error);
      }
    }
  }
}