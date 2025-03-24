'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
}

const RatingStars = ({
  value,
  onChange,
  size = 24,
  readonly = false,
  className,
}: RatingStarsProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (readonly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (readonly) return;

    // If clicking the same star twice, clear the selection
    if (value === index) {
      onChange(0);
    } else {
      onChange(index);
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled =
          hoverValue !== null ? index <= hoverValue : index <= value;

        return (
          <Star
            key={index}
            className={cn(
              'transition-all duration-100',
              isFilled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300',
              !readonly && 'cursor-pointer'
            )}
            size={size}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
