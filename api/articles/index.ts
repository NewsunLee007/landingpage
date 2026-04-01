import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      if (id) {
        const article = await prisma.article.findUnique({
          where: { id: id as string },
        });
        if (!article) {
          return res.status(404).json({ message: 'Article not found' });
        }
        return res.json(article);
      } else {
        const articles = await prisma.article.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.json(articles);
      }
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { title, content, date, summary, imageUrl, tags } = req.body;

      if (!title || !content || !date || !summary) {
        return res.status(400).json({ message: 'Title, content, date and summary are required' });
      }

      const article = await prisma.article.create({
        data: {
          title,
          content,
          date,
          summary,
          imageUrl: imageUrl || null,
          tags: tags || [],
        },
      });

      return res.status(201).json(article);
    }

    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ message: 'Article ID is required' });
      }

      const { title, content, date, summary, imageUrl, tags } = req.body;

      const existingArticle = await prisma.article.findUnique({
        where: { id: id as string },
      });

      if (!existingArticle) {
        return res.status(404).json({ message: 'Article not found' });
      }

      const article = await prisma.article.update({
        where: { id: id as string },
        data: {
          title: title ?? existingArticle.title,
          content: content ?? existingArticle.content,
          date: date ?? existingArticle.date,
          summary: summary ?? existingArticle.summary,
          imageUrl: imageUrl !== undefined ? imageUrl : existingArticle.imageUrl,
          tags: tags !== undefined ? tags : existingArticle.tags,
        },
      });

      return res.json(article);
    }

    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ message: 'Article ID is required' });
      }

      const existingArticle = await prisma.article.findUnique({
        where: { id: id as string },
      });

      if (!existingArticle) {
        return res.status(404).json({ message: 'Article not found' });
      }

      await prisma.article.delete({
        where: { id: id as string },
      });

      return res.json({ message: 'Article deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
