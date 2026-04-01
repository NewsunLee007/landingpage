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
        const app = await prisma.appItem.findUnique({
          where: { id: id as string },
        });
        if (!app) {
          return res.status(404).json({ message: 'App not found' });
        }
        return res.json(app);
      } else {
        const apps = await prisma.appItem.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.json(apps);
      }
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { title, description, url, category, tags, iconName, imageUrl, isPrivate } = req.body;

      if (!title || !description || !url || !category || !iconName) {
        return res.status(400).json({ message: 'Title, description, url, category and iconName are required' });
      }

      const app = await prisma.appItem.create({
        data: {
          title,
          description,
          url,
          category,
          tags: tags || [],
          iconName,
          imageUrl: imageUrl || null,
          isPrivate: isPrivate || false,
        },
      });

      return res.status(201).json(app);
    }

    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ message: 'App ID is required' });
      }

      const { title, description, url, category, tags, iconName, imageUrl, isPrivate } = req.body;

      const existingApp = await prisma.appItem.findUnique({
        where: { id: id as string },
      });

      if (!existingApp) {
        return res.status(404).json({ message: 'App not found' });
      }

      const app = await prisma.appItem.update({
        where: { id: id as string },
        data: {
          title: title ?? existingApp.title,
          description: description ?? existingApp.description,
          url: url ?? existingApp.url,
          category: category ?? existingApp.category,
          tags: tags !== undefined ? tags : existingApp.tags,
          iconName: iconName ?? existingApp.iconName,
          imageUrl: imageUrl !== undefined ? imageUrl : existingApp.imageUrl,
          isPrivate: isPrivate ?? existingApp.isPrivate,
        },
      });

      return res.json(app);
    }

    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ message: 'App ID is required' });
      }

      const existingApp = await prisma.appItem.findUnique({
        where: { id: id as string },
      });

      if (!existingApp) {
        return res.status(404).json({ message: 'App not found' });
      }

      await prisma.appItem.delete({
        where: { id: id as string },
      });

      return res.json({ message: 'App deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
