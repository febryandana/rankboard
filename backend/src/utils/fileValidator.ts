import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs/promises';
import { logger } from '../config/logger';

/**
 * Validates that a file is actually a PDF by checking its magic number
 * @param filePath Path to the file to validate
 * @returns true if file is a valid PDF, false otherwise
 */
export async function validatePDF(filePath: string): Promise<boolean> {
  try {
    const buffer = await fs.readFile(filePath);
    const type = await fileTypeFromBuffer(buffer);

    return type?.mime === 'application/pdf';
  } catch (error) {
    logger.error('Error validating PDF', { filePath, error });
    return false;
  }
}

/**
 * Validates that a file is actually an image by checking its magic number
 * @param filePath Path to the file to validate
 * @returns true if file is a valid image (JPEG, PNG, GIF), false otherwise
 */
export async function validateImage(filePath: string): Promise<boolean> {
  try {
    const buffer = await fs.readFile(filePath);
    const type = await fileTypeFromBuffer(buffer);

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return type ? validTypes.includes(type.mime) : false;
  } catch (error) {
    logger.error('Error validating image', { filePath, error });
    return false;
  }
}
