// @ts-nocheck
import express from 'express';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { articleId, status } = req.query;
    
    logger.info('Fetching comments', { articleId, status });
    
    let where = {};
    if (articleId) {
      where.articleId = articleId;
    }
    if (status) {
      where.status = status;
    }
    // 只返回已批准的评论，除非指定了 status
    if (!status && articleId) {
      where.status = 'approved';
    }
    
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    logger.info('Comments fetched successfully', { count: comments.length, articleId, status });
    res.json(comments);
  } catch (error) {
    logger.error('Get comments error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { articleId, content, author, email } = req.body;
    
    logger.info('Creating comment', { articleId, author });
    
    if (!articleId || !content || !author) {
      logger.warn('Create comment failed: missing required fields', { articleId, author });
      return res.status(400).json({ message: 'Article ID, content and author are required' });
    }
    
    const comment = await prisma.comment.create({
      data: {
        id: crypto.randomUUID(),
        articleId,
        content,
        author,
        email: email || null,
        status: 'pending',
        likes: 0,
      },
    });
    
    logger.info('Comment created successfully', { commentId: comment.id, articleId, author });
    
    res.status(201).json(comment);
  } catch (error) {
    logger.error('Create comment error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, content, likes } = req.body;
    
    logger.info('Updating comment', { commentId: id, status, likes });
    
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });
    
    if (!existingComment) {
      logger.warn('Update comment failed: comment not found', { commentId: id });
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // 处理点赞递增逻辑
    let updateData: any = {
      status: status ?? existingComment.status,
      content: content ?? existingComment.content,
    };
    
    if (likes !== undefined) {
      updateData.likes = (existingComment.likes || 0) + 1;
    }
    
    const comment = await prisma.comment.update({
      where: { id },
      data: updateData,
    });
    
    logger.info('Comment updated successfully', { commentId: id, status: comment.status });
    
    res.json(comment);
  } catch (error) {
    logger.error('Update comment error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info('Deleting comment', { commentId: id });
    
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });
    
    if (!existingComment) {
      logger.warn('Delete comment failed: comment not found', { commentId: id });
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    await prisma.comment.delete({
      where: { id },
    });
    
    logger.info('Comment deleted successfully', { commentId: id });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    logger.error('Delete comment error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
