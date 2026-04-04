import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';
import appsRoutes from './routes/apps.js';
import commentsRoutes from './routes/comments.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { initAdmin } from './initAdmin.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info('Incoming request', { method: req.method, path: req.path, ip: req.ip });
  next();
});

app.get('/api/health', (req, res) => {
  logger.debug('Health check requested');
  res.json({
    status: 'ok',
    message: 'Blog Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/comments', commentsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    logger.info('Initializing admin user...');
    await initAdmin();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
