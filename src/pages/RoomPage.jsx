import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useSocketStore } from '../store/useSocketStore';
import { initializeSocketListeners } from '../sockets/socket';
import AppShell from '../components/layout/AppShell';
import RoomHeader from '../components/room/RoomHeader';
import PlayerList from '../components/room/PlayerList';
import JoinRoom from '../components/lobby/JoinRoom';
import { Button } from '../components/ui/Button';
import { Users, Play } from 'lucide-react';
import { cn } from '../lib/utils';

export const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const roomName = useRoomStore((state) => state.roomName);
  const playerName = useRoomStore((state) => state.playerName);
  const players = useRoomStore((state) => state.players);
  const status = useRoomStore((state) => state.status);
  const difficulty = useRoomStore((state) => state.difficulty);

  const socket = useSocketStore((state) => state.socket);
  const connect = useSocketStore((state) => state.connect);

  // 1. Initialize listeners if socket is connected
  useEffect(() => {
    if (socket) {
      initializeSocketListeners(socket);
    }
  }, [socket]);

  // 2. Redirect to play page if game status changes to playing
  useEffect(() => {
    if (status === 'playing' && roomId) {
      navigate(`/room/${roomId}/play`);
    }
  }, [status, roomId, navigate]);

  // If player hasn't joined (no name or mismatching room), show join prompt
  const hasJoined = playerName && roomName && roomName.toUpperCase() === roomId?.toUpperCase();

  if (!hasJoined) {
    return (
      <AppShell>
        <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-4">
          <div className="flex items-center justify-center bg-primary border-3 border-main p-3.5 rounded-none shadow-[4px_4px_0px_#111111] mb-1">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight">Join Sudoku Battle</h2>
            <p className="text-sm text-muted mt-2">
              Enter your nickname to join the room <span className="font-mono font-bold text-main">{roomId?.toUpperCase()}</span>.
            </p>
          </div>
          <div className="w-full">
            <JoinRoom initialRoomId={roomId} />
          </div>
        </div>
      </AppShell>
    );
  }

  // Host detection: First player in entries
  const playerEntries = Object.entries(players);
  const hostId = playerEntries[0]?.[0];
  const isHost = socket && socket.id === hostId;

  const handleStartGame = () => {
    if (socket) {
      socket.emit('start-game');
    }
  };

  const handleDifficultyChange = (level) => {
    if (socket) {
      socket.emit('change-difficulty', { difficulty: level });
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <RoomHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left panel: player list */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <PlayerList />
          </div>

          {/* Right panel: actions/instructions */}
          <div className="border-3 border-main p-5 bg-accent-light flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-wide uppercase select-none border-b border-neutral-300 pb-2">
              Lobby Controls
            </h3>

            {isHost ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted font-semibold leading-relaxed">
                  As the **Host**, you can select the game difficulty and start the battle once all players have joined.
                </p>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wide uppercase text-muted">
                    Game Difficulty
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['easy', 'medium', 'hard', 'test'].map((level) => {
                      const isSelected = difficulty === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleDifficultyChange(level)}
                          className={cn(
                            "border-3 border-main px-3 py-2 text-xs font-black uppercase transition-all duration-100 select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-center",
                            {
                              "bg-primary text-white shadow-flat-sm": isSelected,
                              "bg-white text-main hover:bg-accent-highlight shadow-flat-sm": !isSelected
                            }
                          )}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleStartGame}
                  variant="default"
                  className="w-full flex items-center justify-center gap-2 py-3 mt-1"
                  disabled={playerEntries.length === 0}
                >
                  <Play className="h-4.5 w-4.5 fill-white" />
                  Start Sudoku Battle
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted font-semibold leading-relaxed animate-pulse">
                  ⌛ Waiting for host to start the game...
                </p>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold tracking-wide uppercase text-muted">
                    Selected Difficulty
                  </span>
                  <div className="border-3 border-main px-3 py-2 bg-white text-xs font-black uppercase text-center tracking-wider">
                    {difficulty}
                  </div>
                </div>

                <div className="border border-dashed border-neutral-300 p-3 bg-card text-center text-xs text-muted font-bold uppercase">
                  Prepare Your Mind
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default RoomPage;
