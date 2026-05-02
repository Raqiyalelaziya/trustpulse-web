import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StarRating({ rating, size = 'md', interactive = false, onChange }) {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' };
  const iconSize = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={cn(
            'transition-transform',
            interactive && 'hover:scale-125 cursor-pointer',
            !interactive && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              iconSize,
              'transition-colors',
              star <= rating
                ? 'fill-accent text-accent'
                : 'fill-none text-muted-foreground/30'
            )}
          />
        </button>
      ))}
    </div>
  );
}