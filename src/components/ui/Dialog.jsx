import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-main/50 backdrop-blur-[1px]"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      {/* Content Box */}
      <div className="relative z-10 w-full max-w-md border-3 border-main bg-card p-6 shadow-flat max-h-[90vh] overflow-y-auto">
        {onOpenChange && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-1 hover:bg-accent-highlight border-2 border-transparent hover:border-main transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-left mb-4", className)} {...props} />
);

export const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-xl font-extrabold tracking-tight", className)} {...props} />
);

export const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col sm:flex-row sm:justify-end sm:space-x-2 mt-6 gap-2 sm:gap-0", className)} {...props} />
);
