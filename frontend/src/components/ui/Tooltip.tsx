import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <span
        className={cn(
          'absolute z-50 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'pointer-events-none whitespace-nowrap border shadow-lg',
          positionClasses[position]
        )}
        role="tooltip"
      >
        {content}
      </span>
    </div>
  );
}
