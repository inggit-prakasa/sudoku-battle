import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useSocketStore } from '../store/useSocketStore';
import { initializeSocketListeners } from '../sockets/socket';
import AppShell from '../components/layout/AppShell';
import RoomHeader from '../components/room/RoomHeader';
import PlayerList from '../components/room/PlayerList';
import RoomChat from '../components/room/RoomChat';
import CountdownOverlay from '../components/room/CountdownOverlay';
import JoinRoom from '../components/lobby/JoinRoom';
import { Button } from '../components/ui/Button';
import { Users, Play, CheckCircle2, AlertCircle } from 'lucide-react';
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

  // Host detection & ready state computations
  const playerEntries = Object.entries(players);
  const hostId = playerEntries[0]?.[0];
  const isHost = socket && socket.id === hostId;

  const selfSocketId = socket?.id;
  const selfPlayer = players[selfSocketId] || {};
  const isSelfReady = !!selfPlayer.isReady;

  const nonHostEntries = playerEntries.filter(([id]) => id !== hostId);
  const allNonHostReady = nonHostEntries.every(([, p]) => p.isReady);
  const canHostStart = nonHostEntries.length === 0 || allNonHostReady;

  const handleStartGame = () => {
    if (socket) {
      socket.emit('start-game');
    }
  };

  const handleToggleReady = () => {
    if (socket) {
      socket.emit('toggle-ready');
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel: Player List & Lobby Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <PlayerList />

            {/* Lobby Controls Card */}
            <div className="border-3 border-main p-5 bg-accent-light flex flex-col gap-4 shadow-flat-sm">
              <h3 className="text-sm font-extrabold tracking-wide uppercase select-none border-b border-neutral-300 pb-2">
                Lobby Controls
              </h3>

              {isHost ? (
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-muted font-semibold leading-relaxed">
                    As the <span className="font-bold text-main">Host</span>, you can change difficulty and start the battle once all players click <span className="text-emerald-700 font-bold">READY</span>.
                  </p>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold tracking-wide uppercase text-muted">
                      Game Difficulty
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

                  {!canHostStart && (
                    <div className="flex items-center gap-2 border-2 border-amber-500 bg-amber-100 p-2.5 text-xs text-amber-900 font-bold">
                      <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                      <span>Waiting for all players to set state to READY...</span>
                    </div>
                  )}

                  <Button
                    onClick={handleStartGame}
                    variant="default"
                    className={cn("w-full flex items-center justify-center gap-2 py-3 mt-1", {
                      "opacity-50 cursor-not-allowed": !canHostStart
                    })}
                    disabled={!canHostStart || status === 'starting'}
                  >
                    <Play className="h-4.5 w-4.5 fill-white" />
                    {status === 'starting' ? 'Starting Battle...' : 'Start Sudoku Battle'}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-white border-2 border-main p-3">
                    <span className="text-xs font-extrabold uppercase text-muted">Selected Difficulty</span>
                    <span className="text-xs font-black uppercase bg-primary text-white px-2.5 py-1 border border-main">
                      {difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-muted font-semibold leading-relaxed">
                    Set your status to <span className="font-bold text-emerald-700">READY</span> so the host can start the game!
                  </p>

                  <Button
                    onClick={handleToggleReady}
                    variant="outline"
                    className={cn("w-full flex items-center justify-center gap-2 py-3.5 font-black text-sm transition-all", {
                      "bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-main shadow-flat-sm": !isSelfReady,
                      "bg-amber-400 hover:bg-amber-500 text-main border-3 border-main shadow-flat-sm": isSelfReady
                    })}
                  >
                    {isSelfReady ? (
                      <>
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        YOU ARE READY (CLICK TO CANCEL)
                      </>
                    ) : (
                      <>
                        <Play className="h-4.5 w-4.5 fill-white" />
                        SET STATE READY
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Room Chat */}
          <div className="lg:col-span-5 w-full">
            <RoomChat />
          </div>
        </div>
      </div>

      <CountdownOverlay />
    </AppShell>
  );
};

export default RoomPage;
