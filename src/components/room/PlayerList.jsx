import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { useSocketStore } from '../../store/useSocketStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Trophy, AlertCircle } from 'lucide-react';

export const PlayerList = () => {
  const players = useRoomStore((state) => state.players);
  const totalEmptyCells = useRoomStore((state) => state.totalEmptyCells);
  const status = useRoomStore((state) => state.status);
  
  const socket = useSocketStore((state) => state.socket);
  const selfSocketId = socket?.id;

  const playerEntries = Object.entries(players);
  if (playerEntries.length === 0) {
    return <div className="text-center text-sm text-muted font-bold">No players in lobby.</div>;
  }

  // Define host as the first player in the list
  const hostId = playerEntries[0]?.[0];

  return (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="text-sm font-bold tracking-wide uppercase select-none border-b-2 border-main pb-1.5 mb-1">
        Players ({playerEntries.length})
      </h3>
      <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1">
        {playerEntries.map(([id, player]) => {
          const isSelf = id === selfSocketId;
          const isHost = id === hostId;
          
          // Progress bar percentage calculation
          const progress = player.progress || 0;
          const mistakes = player.mistakes || 0;
          const percent = totalEmptyCells > 0 ? Math.min(100, Math.round((progress / totalEmptyCells) * 100)) : 0;

          return (
            <div
              key={id}
              className={`flex flex-col border-3 border-main rounded-none p-3 bg-card ${
                isSelf ? 'shadow-[3px_3px_0px_#111111]' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Avatar name={player.name} size="sm" />
                  <span className="font-bold text-sm sm:text-base">
                    {player.name}
                  </span>
                  {isSelf && <Badge variant="secondary">You</Badge>}
                  {isHost ? (
                    <Badge variant="default">Host</Badge>
                  ) : (
                    (status === 'waiting' || status === 'starting') && (
                      player.isReady ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border-2 border-emerald-600 px-2 py-0.5 shadow-flat-sm">
                          Ready ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border-2 border-amber-500 px-2 py-0.5 shadow-flat-sm">
                          Not Ready
                        </span>
                      )
                    )
                  )}
                </div>
                
                {status === 'playing' && (
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1 text-accent-errorText bg-accent-error border border-accent-errorText px-1.5 py-0.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {mistakes}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar (Only during active game or game over) */}
              {status !== 'waiting' && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted uppercase">
                    <span>Progress: {progress} / {totalEmptyCells}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 border-3 border-main h-4 overflow-hidden rounded-none">
                    <div
                      className="bg-primary h-full transition-all duration-300 border-r border-main"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
