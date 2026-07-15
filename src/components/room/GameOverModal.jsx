import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { useSocketStore } from '../../store/useSocketStore';
import { useGameStore } from '../../store/useGameStore';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Trophy, AlertCircle, RefreshCw } from 'lucide-react';

export const GameOverModal = () => {
  const winner = useRoomStore((state) => state.winner);
  const status = useRoomStore((state) => state.status);
  const players = useRoomStore((state) => state.players);
  const totalEmptyCells = useRoomStore((state) => state.totalEmptyCells);
  const resetGameStore = useGameStore((state) => state.resetGameStore);

  const socket = useSocketStore((state) => state.socket);

  const isOpen = status === 'gameover' && winner !== null;

  const handlePlayAgain = () => {
    if (socket) {
      socket.emit('reset-game');
      resetGameStore();
    }
  };

  if (!isOpen) return null;

  const sortedPlayers = Object.entries(players).sort((a, b) => {
    // Sort by progress descending, then mistakes ascending
    if (b[1].progress !== a[1].progress) {
      return (b[1].progress || 0) - (a[1].progress || 0);
    }
    return (a[1].mistakes || 0) - (b[1].mistakes || 0);
  });

  return (
    <Dialog open={isOpen}>
      <DialogHeader>
        <div className="flex justify-center mb-3">
          <div className="bg-primary border-3 border-main p-3.5 rounded-none shadow-[4px_4px_0px_#111111] animate-bounce">
            <Trophy className="h-10 w-10 text-white" />
          </div>
        </div>
        <DialogTitle className="text-center text-2xl font-black font-mono">
          BATTLE COMPLETE!
        </DialogTitle>
        <DialogDescription className="text-center font-bold text-main mt-1 text-base">
          🏆 Winner: <span className="text-primary font-extrabold">{winner.winnerName}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted border-b border-main pb-1">
          Final Standings
        </h4>
        <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
          {sortedPlayers.map(([id, player], idx) => {
            const isWinner = id === winner.winnerId;
            const progress = player.progress || 0;
            const mistakes = player.mistakes || 0;

            return (
              <div
                key={id}
                className={`flex justify-between items-center border-3 border-main rounded-none p-2 text-sm font-bold ${
                  isWinner ? 'bg-[#fffbeb] border-amber-500' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted w-4">#{idx + 1}</span>
                  <span className="truncate max-w-[120px]">{player.name}</span>
                  {isWinner && <span className="text-xs text-amber-600">🥇</span>}
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted">
                    {progress} / {totalEmptyCells} cells
                  </span>
                  <span className="flex items-center gap-0.5 text-accent-errorText bg-accent-error px-1 border border-accent-errorText">
                    <AlertCircle className="h-3 w-3" />
                    {mistakes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={handlePlayAgain}
          variant="default"
          className="w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Play Another Round
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GameOverModal;
