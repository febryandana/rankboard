import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy HH:mm');
}

export function getTimeRemaining(deadline: string | Date): {
  isPast: boolean;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
} {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { isPast: true, years: 0, months: 0, days: 0, hours: 0, minutes: 0 };
  }

  // Calculate years and months more accurately
  let years = deadlineDate.getFullYear() - now.getFullYear();
  let months = deadlineDate.getMonth() - now.getMonth();

  // Adjust if the deadline month/day hasn't been reached yet this year
  if (months < 0) {
    years--;
    months += 12;
  }

  // Create a date for calculating remaining days
  const tempDate = new Date(now.getFullYear() + years, now.getMonth() + months, now.getDate());
  const remainingDiff = deadlineDate.getTime() - tempDate.getTime();

  const days = Math.floor(remainingDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { isPast: false, years, months, days, hours, minutes };
}

export function formatTimeRemaining(deadline: string | Date): string {
  const { isPast, years, months, days, hours, minutes } = getTimeRemaining(deadline);

  if (isPast) {
    return 'Expired';
  }

  if (years > 0) {
    return `${years} year${years !== 1 ? 's' : ''} ${months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : ''} left`.trim();
  }

  if (months > 0) {
    return `${months} month${months !== 1 ? 's' : ''} ${days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : ''} left`.trim();
  }

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  }

  return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
}

export function validateFilename(filename: string): boolean {
  return !filename.includes(' ');
}

export function getAvatarUrl(filename: string | null): string {
  if (!filename) {
    return '/default-avatar.png';
  }
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  return `${baseUrl}/uploads/avatars/${filename}`;
}

export function getSubmissionUrl(filename: string): string {
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  return `${baseUrl}/uploads/submissions/${filename}`;
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
