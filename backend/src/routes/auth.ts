import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    logger.info('Login attempt', { username });

    if (!username || !password) {
      logger.warn('Login failed: missing credentials', { username });
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      logger.warn('Login failed: user not found', { username });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', { username });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info('Login successful', { username, adminId: admin.id });

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
