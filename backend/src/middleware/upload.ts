import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { validatePDF, validateImage } from '../utils/fileValidator';

const avatarsDir = path.resolve(__dirname, '../../uploads/avatars');
const submissionsDir = path.resolve(__dirname, '../../uploads/submissions');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
}

export const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: avatarsDir,
    filename: (req, file, cb) => {
      const userId = (req as any).session?.userId || 'unknown';
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const filename = `avatar_${userId}_${timestamp}${ext}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF allowed.'));
    }
  },
});

export const submissionUpload = multer({
  storage: multer.diskStorage({
    destination: submissionsDir,
    filename: (req, file, cb) => {
      if (file.originalname.includes(' ')) {
        cb(new Error('Filename must not contain spaces'), '');
        return;
      }

      const userId = (req as any).session?.userId || 'unknown';
      const challengeId = req.params.challengeId || 'unknown';
      const timestamp = Date.now();
      const filename = `submission_${userId}_${challengeId}_${timestamp}.pdf`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
});

// Wrapper middleware for submission upload with validation
export const submissionUploadWithValidation = [
  submissionUpload.single('submission'),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    try {
      const isValid = await validatePDF(req.file.path);
      if (!isValid) {
        // Delete invalid file
        await fs.promises.unlink(req.file.path);
        return res.status(400).json({
          success: false,
          error: 'Invalid PDF file. File appears to be corrupted or not a real PDF.',
        });
      }
      next();
    } catch (error) {
      // Clean up file on error
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }
      next(error);
    }
  },
];

// Wrapper middleware for avatar upload with validation
export const avatarUploadWithValidation = [
  avatarUpload.single('avatar'),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    try {
      const isValid = await validateImage(req.file.path);
      if (!isValid) {
        // Delete invalid file
        await fs.promises.unlink(req.file.path);
        return res.status(400).json({
          success: false,
          error: 'Invalid image file. File appears to be corrupted or not a real image.',
        });
      }
      next();
    } catch (error) {
      // Clean up file on error
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }
      next(error);
    }
  },
];
