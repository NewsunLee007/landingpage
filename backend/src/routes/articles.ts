// @ts-nocheck
import express from 'express';
import { prisma } from '../prisma.js';
import { authenticateJWT, type AuthRequest } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

type DbArticle = {
  id: string;
  title: string;
  content: string;
  date: string;
  summary: string;
  imageUrl: string | null;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
};

type Article = Omit<DbArticle, 'tags'> & {
  tags: string[];
};

router.get('/', async (req, res) => {
  try {
    logger.info('Fetching all articles');
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    logger.info('Articles fetched successfully', { count: articles.length });
    res.json(articles.map((article: any) => ({
      ...article,
      tags: JSON.parse(article.tags || '[]')
    })));
  } catch (error) {
    logger.error('Get articles error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Fetching article', { id });
    const article = await prisma.article.findUnique({
      where: { id }
    });
    if (!article) {
      logger.warn('Article not found', { id });
      return res.status(404).json({ message: 'Article not found' });
    }
    logger.info('Article fetched successfully', { id });
    res.json({
      ...article,
      tags: JSON.parse((article as any).tags || '[]')
    });
  } catch (error) {
    logger.error('Get article error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { title, content, date, summary, imageUrl, tags } = req.body;
    
    logger.info('Creating article', { adminId: req.adminId, title });
    
    if (!title || !content || !date || !summary) {
      logger.warn('Create article failed: missing required fields', { adminId: req.adminId });
      return res.status(400).json({ message: 'Title, content, date and summary are required' });
    }
    
    const article = await prisma.article.create({
      data: {
        id: crypto.randomUUID(),
        title,
        content,
        date,
        summary,
        imageUrl: imageUrl || null,
        tags: JSON.stringify(tags || []) as string
      }
    });
    
    logger.info('Article created successfully', { adminId: req.adminId, articleId: article.id, title });
    
    res.status(201).json({
      ...article,
      tags: JSON.parse(article.tags || '[]')
    });
  } catch (error) {
    logger.error('Create article error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, content, date, summary, imageUrl, tags } = req.body;
    
    logger.info('Updating article', { adminId: req.adminId, articleId: id });
    
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });
    
    if (!existingArticle) {
      logger.warn('Update article failed: article not found', { adminId: req.adminId, articleId: id });
      return res.status(404).json({ message: 'Article not found' });
    }
    
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title ?? existingArticle.title,
        content: content ?? existingArticle.content,
        date: date ?? existingArticle.date,
        summary: summary ?? existingArticle.summary,
        imageUrl: imageUrl !== undefined ? imageUrl : existingArticle.imageUrl,
        tags: tags !== undefined ? JSON.stringify(tags) : existingArticle.tags as string
      }
    });
    
    logger.info('Article updated successfully', { adminId: req.adminId, articleId: id });
    
    res.json({
      ...article,
      tags: JSON.parse(article.tags || '[]')
    });
  } catch (error) {
    logger.error('Update article error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    logger.info('Deleting article', { adminId: req.adminId, articleId: id });
    
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });
    
    if (!existingArticle) {
      logger.warn('Delete article failed: article not found', { adminId: req.adminId, articleId: id });
      return res.status(404).json({ message: 'Article not found' });
    }
    
    await prisma.article.delete({
      where: { id }
    });
    
    logger.info('Article deleted successfully', { adminId: req.adminId, articleId: id });
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    logger.error('Delete article error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
