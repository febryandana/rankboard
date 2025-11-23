import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RankBoard API',
      version: '1.0.0',
      description: 'Challenges Scoring & Leaderboard Platform API Documentation',
      contact: {
        name: 'RankBoard Team',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url:
          env.NODE_ENV === 'production'
            ? 'https://api.rankboard.com'
            : `http://localhost:${env.PORT}`,
        description: env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'rankboard.sid',
          description: 'Session cookie authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
            avatar_filename: { type: 'string', nullable: true, example: 'avatar.jpg' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Challenge: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Algorithm Challenge' },
            description: { type: 'string', example: 'Solve the sorting problem' },
            deadline: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            created_by_admin_id: { type: 'integer', example: 1 },
          },
        },
        Submission: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            challenge_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 2 },
            filename: { type: 'string', example: 'submission.pdf' },
            submitted_at: { type: 'string', format: 'date-time' },
          },
        },
        Score: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            submission_id: { type: 'integer', example: 1 },
            admin_id: { type: 'integer', example: 1 },
            score: { type: 'number', format: 'float', example: 85.5 },
            feedback: { type: 'string', nullable: true, example: 'Great work!' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error message' },
            details: { type: 'string', example: 'Additional error details' },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
