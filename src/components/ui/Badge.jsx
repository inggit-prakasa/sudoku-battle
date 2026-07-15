import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ children, className, variant = 'default' }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center border-3 border-main rounded-none px-2 py-0.5 text-xs font-bold select-none leading-none",
        {
          "bg-primary text-white": variant === 'default',
          "bg-card text-main": variant === 'outline',
          "bg-accent-highlight text-main": variant === 'secondary',
          "bg-accent-error text-accent-errorText border-accent-errorText": variant === 'danger',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
