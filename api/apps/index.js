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
        const apps = await prisma.appItem.findMany();
        res.json(apps);
      } else {
        res.json([]);
      }
    } else if (req.method === 'POST') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const appData = req.body;
      const newApp = await prisma.appItem.create({
        data: appData,
      });
      res.json(newApp);
    } else if (req.method === 'PUT') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id, ...appData } = req.body;
      const updatedApp = await prisma.appItem.update({
        where: { id },
        data: appData,
      });
      res.json(updatedApp);
    } else if (req.method === 'DELETE') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id } = req.body;
      await prisma.appItem.delete({
        where: { id },
      });
      res.json({ message: 'App deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('App API error:', error);
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