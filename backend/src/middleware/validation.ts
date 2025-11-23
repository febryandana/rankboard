import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Password schema with complexity requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: passwordSchema,
  role: z.enum(['admin', 'user']),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: passwordSchema.optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const createChallengeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string(),
  created_at: z.string().datetime(),
  deadline: z.string().datetime(),
});

export const updateChallengeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  created_at: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
});

export const createScoreSchema = z.object({
  score: z.number().int().min(0),
  feedback: z.string().optional(),
});

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
}
