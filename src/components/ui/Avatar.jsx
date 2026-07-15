import React from 'react';
import { cn } from '../../lib/utils';

export const Avatar = ({ name, className, size = 'default' }) => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  // Deterministic color combinations based on the user's name
  const colorSchemes = [
    'bg-primary text-white border-main',
    'bg-accent-select text-primary border-main',
    'bg-accent-highlight text-main border-main',
    'bg-neutral-200 text-main border-main',
    'bg-orange-100 text-primary border-main',
  ];

  const charCodeSum = name
    ? [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  const chosenScheme = colorSchemes[charCodeSum % colorSchemes.length];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-bold border-3 aspect-square rounded-none select-none",
        chosenScheme,
        {
          "w-8 h-8 text-xs": size === 'sm',
          "w-10 h-10 text-sm": size === 'default',
          "w-14 h-14 text-lg": size === 'lg',
        },
        className
      )}
    >
      {initial}
    </div>
  );
};
