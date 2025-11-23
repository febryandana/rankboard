import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // Session
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),

  // Root Admin
  ROOT_ADMIN_USERNAME: z.string().min(3, 'ROOT_ADMIN_USERNAME must be at least 3 characters'),
  ROOT_ADMIN_EMAIL: z.string().email('ROOT_ADMIN_EMAIL must be a valid email'),
  ROOT_ADMIN_PASSWORD: z.string().min(8, 'ROOT_ADMIN_PASSWORD must be at least 8 characters'),

  // Optional
  DATABASE_PATH: z.string().optional(),
  UPLOAD_DIR: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    // Cannot use logger here as it depends on env being validated first
    console.error('❌ Environment validation failed:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const env = validateEnv();
