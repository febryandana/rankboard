import { type Challenge } from '../../types';
import { formatDate, formatTimeRemaining, getTimeRemaining } from '../../lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: () => void;
  isSubmitted?: boolean;
}

export default function ChallengeCard({
  challenge,
  onClick,
  isSubmitted = false,
}: ChallengeCardProps) {
  const { isPast } = getTimeRemaining(challenge.deadline);
  const timeRemainingText = formatTimeRemaining(challenge.deadline);

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border rounded-lg p-6 cursor-pointer',
        'hover-lift transition-smooth',
        'focus-ring',
        'relative overflow-hidden group'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${challenge.title}`}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">{challenge.title}</h3>

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created: {formatDate(challenge.created_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span className={cn(isPast ? 'text-destructive' : 'text-foreground')}>
            {timeRemainingText}
          </span>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2">
        {/* Submission status badge */}
        {isSubmitted ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Submitted
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </span>
        )}

        {/* Deadline status badge */}
        {isPast && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
            Expired
          </span>
        )}
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:from-primary/20 transition-all duration-300" />
    </div>
  );
}
