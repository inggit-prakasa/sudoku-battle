import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useSocketStore } from '../store/useSocketStore';
import { useGameStore } from '../store/useGameStore';
import { initializeSocketListeners } from '../sockets/socket';
import AppShell from '../components/layout/AppShell';
import RoomHeader from '../components/room/RoomHeader';
import PlayerList from '../components/room/PlayerList';
import SudokuGrid from '../components/grid/SudokuGrid';
import GameOverModal from '../components/room/GameOverModal';
import { Button } from '../components/ui/Button';
import { Clock, AlertCircle, Trash2 } from 'lucide-react';

export const GamePage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const roomName = useRoomStore((state) => state.roomName);
  const playerName = useRoomStore((state) => state.playerName);
  const players = useRoomStore((state) => state.players);
  const status = useRoomStore((state) => state.status);
  const totalEmptyCells = useRoomStore((state) => state.totalEmptyCells);

  const socket = useSocketStore((state) => state.socket);
  const timerSeconds = useGameStore((state) => state.timerSeconds);
  const selectedCell = useGameStore((state) => state.selectedCell);
  const setCellValue = useGameStore((state) => state.setCellValue);

  // 1. Initialize listeners
  useEffect(() => {
    if (socket) {
      initializeSocketListeners(socket);
    }
  }, [socket]);

  // 2. Redirect back to lobby if game resets to waiting
  useEffect(() => {
    if (status === 'waiting' && roomId) {
      navigate(`/room/${roomId}`);
    }
  }, [status, roomId, navigate]);

  // 3. Security redirect: if player has not joined, redirect to Room Page to enter details
  const hasJoined = playerName && roomName && roomName.toUpperCase() === roomId?.toUpperCase();
  useEffect(() => {
    if (!hasJoined && roomId) {
      navigate(`/room/${roomId}`);
    }
  }, [hasJoined, roomId, navigate]);

  if (!hasJoined) {
    return null; // Page is redirecting
  }

  // Get active user's stats
  const selfSocketId = socket?.id;
  const selfPlayer = players[selfSocketId] || {};
  const selfProgress = selfPlayer.progress || 0;
  const selfMistakes = selfPlayer.mistakes || 0;
  const progressPercent = totalEmptyCells > 0 ? Math.min(100, Math.round((selfProgress / totalEmptyCells) * 100)) : 0;

  // Format Time Helper
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Numpad clicks
  const handleNumpadClick = (num) => {
    if (selectedCell) {
      setCellValue(selectedCell.r, selectedCell.c, num, socket);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <RoomHeader />

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 w-full text-center">
          <div className="border-2 border-main p-2 bg-accent-light flex flex-col justify-center items-center">
            <span className="text-[10px] font-bold text-muted uppercase flex items-center gap-1">
              <Clock className="h-3 w-3" /> Time Elapsed
            </span>
            <span className="text-sm sm:text-base font-mono font-black mt-0.5">
              {formatTime(timerSeconds)}
            </span>
          </div>

          <div className="border-2 border-main p-2 bg-accent-light flex flex-col justify-center items-center">
            <span className="text-[10px] font-bold text-muted uppercase flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Mistakes
            </span>
            <span className="text-sm sm:text-base font-black text-accent-errorText mt-0.5">
              {selfMistakes}
            </span>
          </div>

          <div className="border-2 border-main p-2 bg-accent-light flex flex-col justify-center items-center">
            <span className="text-[10px] font-bold text-muted uppercase">
              Solved Ratio
            </span>
            <span className="text-sm sm:text-base font-black text-primary mt-0.5">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Play layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center: The active grid & Numpad */}
          <div className="md:col-span-8 flex flex-col items-center gap-4">
            <div className="w-full flex justify-center">
              <SudokuGrid />
            </div>

            {/* Numpad Container */}
            <div className="flex flex-col items-center gap-2 w-full max-w-[420px]">
              <div className="grid grid-cols-5 gap-2 w-full">
                {Array.from({ length: 9 }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <Button
                      key={num}
                      onClick={() => handleNumpadClick(num)}
                      variant="outline"
                      className="h-11 text-base sm:text-lg font-black"
                      disabled={!selectedCell}
                    >
                      {num}
                    </Button>
                  );
                })}
                <Button
                  onClick={() => handleNumpadClick(0)}
                  variant="danger"
                  className="h-11 p-0 flex items-center justify-center"
                  disabled={!selectedCell}
                  title="Clear cell"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
              <p className="text-[10px] text-muted font-semibold tracking-wide uppercase select-none mt-1">
                Tip: You can use your keyboard arrows and keys 1-9 to play!
              </p>
            </div>
          </div>

          {/* Right: Players dashboard */}
          <div className="md:col-span-4 flex flex-col gap-4 border-3 border-main p-4 bg-card h-full">
            <PlayerList />
          </div>
        </div>
      </div>

      {/* Overlay game over trigger modal */}
      <GameOverModal />
    </AppShell>
  );
};

export default GamePage;
