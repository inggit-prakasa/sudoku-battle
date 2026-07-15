import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full border-none border-b-3 border-main bg-transparent px-0 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-100 rounded-none",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
