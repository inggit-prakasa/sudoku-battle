import React from 'react';
import AppShell from '../components/layout/AppShell';
import CreateRoom from '../components/lobby/CreateRoom';
import JoinRoom from '../components/lobby/JoinRoom';
import { Gamepad2 } from 'lucide-react';

export const HomePage = () => {
  return (
    <AppShell>
      <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto py-4">
        <div className="relative mb-2 shrink-0 select-none">
          {/* Stacked Shadow Card */}
          <div className="absolute inset-0 bg-main border-3 border-main translate-x-1.5 translate-y-1.5 -rotate-[4deg]"></div>
          {/* Top Brand Card */}
          <div className="relative bg-primary border-3 border-main p-3.5 -rotate-[4deg] flex items-center justify-center">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="text-center max-w-md">
          <p className="text-base font-bold text-main select-none leading-relaxed px-4">
            A real-time, competitive, multiplayer Sudoku clash. Fill cells correctly to gain points and win the board.
          </p>
        </div>

        {/* Action panels split by vertical divider */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 w-full mt-6 relative">
          <div className="flex-grow flex-1 flex flex-col gap-4 pb-6 md:pb-0 md:pr-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted select-none">
              Option A — Host
            </h3>
            <CreateRoom />
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden md:block w-[3px] bg-main self-stretch"></div>

          <div className="flex-grow flex-1 flex flex-col gap-4 pt-6 md:pt-0 md:pl-8 border-t-3 md:border-t-0 border-main">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted select-none">
              Option B — Join
            </h3>
            <JoinRoom />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default HomePage;
