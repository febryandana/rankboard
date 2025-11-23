import { cn } from '../../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export function LoadingSkeleton({ className, variant = 'rectangular' }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-md',
        variant === 'card' && 'rounded-lg',
        className
      )}
    />
  );
}

export function ChallengeCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <LoadingSkeleton className="h-6 w-3/4" variant="text" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-full" variant="text" />
        <LoadingSkeleton className="h-4 w-2/3" variant="text" />
      </div>
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 w-20" variant="rectangular" />
        <LoadingSkeleton className="h-6 w-20" variant="rectangular" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <LoadingSkeleton className="h-6 w-48" variant="text" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <LoadingSkeleton className="h-10 w-10" variant="circular" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-32" variant="text" />
              <LoadingSkeleton className="h-3 w-48" variant="text" />
            </div>
            <LoadingSkeleton className="h-8 w-24" variant="rectangular" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <LoadingSkeleton className="h-8 w-48 mb-6" variant="text" />
      <div className="space-y-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-24" variant="text" />
          <LoadingSkeleton className="h-10 w-full" variant="rectangular" />
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-24" variant="text" />
          <LoadingSkeleton className="h-10 w-full" variant="rectangular" />
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-32" variant="text" />
          <LoadingSkeleton className="h-32 w-full" variant="rectangular" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <LoadingSkeleton className="h-10 w-24" variant="rectangular" />
        <LoadingSkeleton className="h-10 w-32" variant="rectangular" />
      </div>
    </div>
  );
}
