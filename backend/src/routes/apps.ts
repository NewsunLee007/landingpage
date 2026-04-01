// @ts-nocheck
import express from 'express';
import { prisma } from '../prisma.js';
import { authenticateJWT, type AuthRequest } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

type DbAppItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string;
  iconName: string;
  imageUrl: string | null;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AppItem = Omit<DbAppItem, 'tags'> & {
  tags: string[];
};

router.get('/', async (req, res) => {
  try {
    logger.info('Fetching all apps');
    const apps = await prisma.appItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    logger.info('Apps fetched successfully', { count: apps.length });
    res.json(apps.map((app: any) => ({
      ...app,
      tags: JSON.parse(app.tags || '[]')
    })));
  } catch (error) {
    logger.error('Get apps error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Fetching app', { id });
    const app = await prisma.appItem.findUnique({
      where: { id }
    });
    if (!app) {
      logger.warn('App not found', { id });
      return res.status(404).json({ message: 'App not found' });
    }
    logger.info('App fetched successfully', { id });
    res.json({
      ...app,
      tags: JSON.parse((app as any).tags || '[]')
    });
  } catch (error) {
    logger.error('Get app error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { title, description, url, category, tags, iconName, imageUrl, isPrivate } = req.body;
    
    logger.info('Creating app', { adminId: req.adminId, title });
    
    if (!title || !description || !url || !category || !iconName) {
      logger.warn('Create app failed: missing required fields', { adminId: req.adminId });
      return res.status(400).json({ message: 'Title, description, url, category and iconName are required' });
    }
    
    const app = await prisma.appItem.create({
      data: {
        id: crypto.randomUUID(),
        title,
        description,
        url,
        category,
        tags: JSON.stringify(tags || []) as string,
        iconName,
        imageUrl: imageUrl || null,
        isPrivate: isPrivate || false
      }
    });
    
    logger.info('App created successfully', { adminId: req.adminId, appId: app.id, title });
    
    res.status(201).json({
      ...app,
      tags: JSON.parse(app.tags || '[]')
    });
  } catch (error) {
    logger.error('Create app error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, category, tags, iconName, imageUrl, isPrivate } = req.body;
    
    logger.info('Updating app', { adminId: req.adminId, appId: id });
    
    const existingApp = await prisma.appItem.findUnique({
      where: { id }
    });
    
    if (!existingApp) {
      logger.warn('Update app failed: app not found', { adminId: req.adminId, appId: id });
      return res.status(404).json({ message: 'App not found' });
    }
    
    const app = await prisma.appItem.update({
      where: { id },
      data: {
        title: title ?? existingApp.title,
        description: description ?? existingApp.description,
        url: url ?? existingApp.url,
        category: category ?? existingApp.category,
        tags: tags !== undefined ? JSON.stringify(tags) : existingApp.tags as string,
        iconName: iconName ?? existingApp.iconName,
        imageUrl: imageUrl !== undefined ? imageUrl : existingApp.imageUrl,
        isPrivate: isPrivate ?? existingApp.isPrivate
      }
    });
    
    logger.info('App updated successfully', { adminId: req.adminId, appId: id });
    
    res.json({
      ...app,
      tags: JSON.parse(app.tags || '[]')
    });
  } catch (error) {
    logger.error('Update app error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    logger.info('Deleting app', { adminId: req.adminId, appId: id });
    
    const existingApp = await prisma.appItem.findUnique({
      where: { id }
    });
    
    if (!existingApp) {
      logger.warn('Delete app failed: app not found', { adminId: req.adminId, appId: id });
      return res.status(404).json({ message: 'App not found' });
    }
    
    await prisma.appItem.delete({
      where: { id }
    });
    
    logger.info('App deleted successfully', { adminId: req.adminId, appId: id });
    
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    logger.error('Delete app error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
