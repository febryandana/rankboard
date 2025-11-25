import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { initDatabase } from './config/database';
import sessionMiddleware from './config/session';
import { swaggerSpec } from './config/swagger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import challengeRoutes from './routes/challenges';
import submissionRoutes from './routes/submissions';
import scoreRoutes from './routes/scores';
import * as userService from './services/userService';

const app = express();
const PORT = env.PORT;

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(sessionMiddleware);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://rankboard-frontend',
        'http://rankboard-backend',
        'http://frontend',
        'http://backend',
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin', { origin });
        callback(null, false);
      }
    },
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  })
);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Swagger API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'RankBoard API Documentation',
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api', submissionRoutes);
app.use('/api', scoreRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'RankBoard API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

function ensureDirectories(): void {
  const dirs = [
    path.resolve(__dirname, '../database'),
    path.resolve(__dirname, '../uploads/avatars'),
    path.resolve(__dirname, '../uploads/submissions'),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info('Created directory', { dir });
    }
  });
}

async function createRootAdmin(): Promise<void> {
  try {
    const existingAdmin = await userService.getUserByUsername(env.ROOT_ADMIN_USERNAME);

    if (existingAdmin) {
      logger.info('Root admin already exists');
      return;
    }

    const admin = await userService.createUser({
      username: env.ROOT_ADMIN_USERNAME,
      email: env.ROOT_ADMIN_EMAIL,
      password: env.ROOT_ADMIN_PASSWORD,
      role: 'admin',
    });

    logger.info('Root admin created', { username: admin.username, email: admin.email });
  } catch (error) {
    logger.error('Error creating root admin', { error });
    throw error;
  }
}

async function startServer(): Promise<void> {
  try {
    ensureDirectories();

    logger.info('Initializing database...');
    await initDatabase();
    logger.info('Database initialized successfully');

    await createRootAdmin();

    app.listen(PORT, () => {
      logger.info('');
      logger.info('================================================');
      logger.info('🚀 RankBoard API Server');
      logger.info(`📡 Running on: http://localhost:${PORT}`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
      logger.info(`📁 Database: ${path.resolve(__dirname, '../database/rankboard.db')}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info('================================================');
      logger.info('');
      logger.info('Available endpoints:');
      logger.info('  GET    /api/health');
      logger.info('  POST   /api/auth/login');
      logger.info('  POST   /api/auth/logout');
      logger.info('  GET    /api/auth/session');
      logger.info('  GET    /api/users');
      logger.info('  POST   /api/users');
      logger.info('  GET    /api/users/:id');
      logger.info('  PUT    /api/users/:id');
      logger.info('  DELETE /api/users/:id');
      logger.info('  POST   /api/users/:id/avatar');
      logger.info('  DELETE /api/users/:id/avatar');
      logger.info('  GET    /api/challenges');
      logger.info('  POST   /api/challenges');
      logger.info('  GET    /api/challenges/:id');
      logger.info('  PUT    /api/challenges/:id');
      logger.info('  DELETE /api/challenges/:id');
      logger.info('  GET    /api/challenges/:challengeId/submissions');
      logger.info('  POST   /api/challenges/:challengeId/submissions');
      logger.info('  PUT    /api/challenges/:challengeId/submissions');
      logger.info('  GET    /api/submissions/:id/download');
      logger.info('  GET    /api/challenges/:challengeId/scores');
      logger.info('  POST   /api/submissions/:submissionId/scores');
      logger.info('  GET    /api/submissions/:submissionId/scores/me');
      logger.info('');
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { promise, reason });
  process.exit(1);
});

startServer();
