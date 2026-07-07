import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animation?: 'pulse' | 'wave';
  variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton = ({
  className = '',
  animation = 'pulse',
  variant = 'text',
}: SkeletonProps) => {
  const baseStyles = 'animate-pulse bg-gray-700 rounded';

  const variants = {
    text: 'h-4 w-full',
    circular: 'h-10 w-10 rounded-full',
    rectangular: 'h-48 w-full rounded-lg',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        animations[animation],
        className
      )}
      aria-hidden="true"
    />
  );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
