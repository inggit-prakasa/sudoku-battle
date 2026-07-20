import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/useRoomStore';
import { useSocketStore } from '../../store/useSocketStore';
import { Button } from '../ui/Button';
import { Copy, LogOut } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const RoomHeader = () => {
  const roomName = useRoomStore((state) => state.roomName);
  const addToast = useRoomStore((state) => state.addToast);
  const clearRoom = useRoomStore((state) => state.clearRoom);
  const difficulty = useRoomStore((state) => state.difficulty);

  const socket = useSocketStore((state) => state.socket);
  const disconnect = useSocketStore((state) => state.disconnect);
  const navigate = useNavigate();

  const handleCopyLink = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    addToast('Lobby link copied to clipboard!', 'success');
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-room');
    }
    disconnect();
    clearRoom();
    navigate('/');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-3 border-main rounded-none p-4 bg-card w-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase text-muted tracking-wider">
          Battle Room:
        </span>
        <span className="font-mono font-extrabold text-lg px-2 py-0.5 border-3 border-main rounded-none bg-accent-light">
          {roomName || '------'}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="h-8 px-2"
          title="Copy Room Link"
        >
          <Copy className="h-4 w-4" />
        </Button>
        {difficulty && (
          <Badge
            variant={
              difficulty === 'easy'
                ? 'secondary'
                : difficulty === 'medium'
                  ? 'default'
                  : difficulty === 'hard'
                    ? 'danger'
                    : 'outline'
            }
            className="uppercase tracking-wider px-2 py-0.5 border-3 font-black text-[10px]"
          >
            {difficulty}
          </Badge>
        )}
      </div>

      <Button
        variant="danger"
        size="sm"
        onClick={handleLeave}
        className="flex items-center gap-1.5 self-stretch sm:self-auto h-8 px-3"
      >
        <LogOut className="h-3.5 w-3.5" />
        Leave Room
      </Button>
    </div>
  );
};

export default RoomHeader;
