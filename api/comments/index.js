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
      const { articleId, status } = req.query;
      
      let where = {};
      if (articleId) {
        where.articleId = articleId;
      }
      if (status) {
        where.status = status;
      }
      if (!status && articleId) {
        where.status = 'approved';
      }
      
      if (prisma) {
        try {
          const comments = await prisma.comment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
          });
          res.json(comments);
        } catch (error) {
          console.error('Error fetching comments:', error);
          res.json([]);
        }
      } else {
        res.json([]);
      }
    } else if (req.method === 'POST') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { articleId, content, author, email } = req.body;
      
      if (!articleId || !content || !author) {
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
      
      res.status(201).json(comment);
    } else if (req.method === 'PUT') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const id = req.query.id || req.body.id;
      if (!id) {
        return res.status(400).json({ message: 'Comment ID is required' });
      }
      
      const { status, content, likes } = req.body;
      
      const existingComment = await prisma.comment.findUnique({
        where: { id },
      });
      
      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      let updateData = {
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
      
      res.json(comment);
    } else if (req.method === 'DELETE') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const id = req.query.id || req.body.id;
      if (!id) {
        return res.status(400).json({ message: 'Comment ID is required' });
      }
      
      try {
        await prisma.comment.delete({
          where: { id },
        });
        res.json({ message: 'Comment deleted successfully' });
      } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(404).json({ message: 'Comment not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Comment API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
