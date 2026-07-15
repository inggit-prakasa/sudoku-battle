import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { X, Info, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useRoomStore((state) => state.toasts);
  const removeToast = useRoomStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="h-5 w-5 text-primary shrink-0" />;
        let borderClass = "border-main";

        if (toast.type === 'error') {
          icon = <AlertOctagon className="h-5 w-5 text-accent-errorText shrink-0" />;
          borderClass = "border-accent-errorText";
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />;
          borderClass = "border-yellow-600";
        } else if (toast.type === 'success') {
          icon = <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />;
          borderClass = "border-green-600";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between border-3 bg-card p-3 shadow-flat-sm transform translate-y-0 transition-transform duration-300 ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <span className="text-xs sm:text-sm font-bold text-main">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 hover:bg-accent-highlight border border-transparent hover:border-main transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
