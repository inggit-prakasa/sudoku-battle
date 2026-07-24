import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Flame, Play } from 'lucide-react';

export const CountdownOverlay = () => {
  const countdown = useRoomStore((state) => state.countdown);

  if (countdown === null || countdown === undefined) {
    return null;
  }

  const isStart = countdown === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="border-4 border-main bg-accent-light p-8 sm:p-12 shadow-[8px_8px_0px_#111111] max-w-sm w-full text-center flex flex-col items-center gap-6 transform animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center gap-2 border-2 border-main bg-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-flat-sm">
          <Flame className="h-4 w-4 text-accent-warningText animate-bounce" />
          Battle Starting
        </div>

        <div className="flex items-center justify-center my-2">
          {isStart ? (
            <div className="text-6xl sm:text-7xl font-black tracking-tighter text-primary animate-pulse flex items-center gap-2">
              <Play className="h-14 w-14 fill-primary" />
              GO!
            </div>
          ) : (
            <div className="text-7xl sm:text-8xl font-mono font-black text-main animate-bounce">
              {countdown}
            </div>
          )}
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-muted select-none">
          {isStart ? "The game has begun!" : "Get ready to solve..."}
        </p>

        <div className="w-full bg-neutral-200 border-2 border-main h-3 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-1000"
            style={{ width: isStart ? '100%' : `${((4 - countdown) / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CountdownOverlay;
