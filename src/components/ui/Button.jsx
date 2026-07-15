import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold border-3 border-main rounded-none transition-all duration-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        {
          "bg-primary text-white hover:bg-primary-hover border-main shadow-flat": variant === 'default',
          "bg-white text-main hover:bg-accent-highlight border-main shadow-flat-orange": variant === 'outline',
          "bg-transparent text-main hover:bg-accent-highlight border-transparent": variant === 'ghost',
          "bg-accent-error text-accent-errorText hover:bg-red-100 border-accent-errorText shadow-flat": variant === 'danger',
          
          "h-10 px-5 text-sm": size === 'default',
          "h-8 px-3 text-xs": size === 'sm',
          "h-12 px-8 text-base": size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';
