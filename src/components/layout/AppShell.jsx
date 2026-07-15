import React from 'react';
import { ToastContainer } from '../ui/Toast';

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 max-w-4xl mx-auto w-full">
      <header className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono select-none">
            SUDOKU<span className="text-primary font-sans">BATTLE</span>
          </h1>
          <div className="h-1 bg-main w-36 mt-1"></div>
          <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-muted uppercase mt-2.5">
            Real-time Multiplayer Sudoku Grid
          </p>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-4 w-full">
        <div className="w-full bg-card border-3 border-main p-6 sm:p-8 shadow-flat-lg rounded-none relative">
          {children}
        </div>
      </main>

      <footer className="text-center text-xs text-muted font-bold tracking-wider mt-6 pt-4 border-t-2 border-dashed border-neutral-300">
        SUDOKU BATTLE — MULTIPLAYER BATTLE ROYALE
      </footer>
      <ToastContainer />
    </div>
  );
};
export default AppShell;
