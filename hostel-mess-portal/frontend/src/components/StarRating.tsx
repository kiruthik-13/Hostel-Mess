import { useState } from 'react';
import Icon from './Icon';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  interactive?: boolean;
  className?: string;
}

export default function StarRating({
  value,
  onChange,
  size = 26,
  interactive = false,
  className = '',
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const active = hover || value;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={interactive ? () => setHover(star) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={interactive ? 'cursor-pointer p-0.5 transition-transform hover:scale-110 disabled:cursor-default' : 'cursor-default p-0.5'}
            style={{ color: filled ? '#f97316' : '#d8cdc6' }}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Icon
              name="star"
              filled={filled}
              size={size}
              weight={filled ? 500 : 300}
            />
          </button>
        );
      })}
    </div>
  );
}