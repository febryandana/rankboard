import winston from 'winston';
import { env } from './env';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      const filtered = { ...meta };
      delete filtered.timestamp;
      delete filtered.level;
      delete filtered.message;
      if (Object.keys(filtered).length > 0) {
        msg += ` ${JSON.stringify(filtered)}`;
      }
    }
    return msg;
  })
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'rankboard-backend' },
  transports: [
    // Console output
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // File outputs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Create a stream object for Morgan HTTP logging middleware
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
