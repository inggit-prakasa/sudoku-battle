import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '../../store/useSocketStore';
import { useRoomStore } from '../../store/useRoomStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const JoinRoom = ({ initialRoomId = '' }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState(initialRoomId);
  const connect = useSocketStore((state) => state.connect);
  const setRoom = useRoomStore((state) => state.setRoom);
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim() || !roomId.trim()) return;

    const cleanRoomId = roomId.trim().toUpperCase();

    // Connect socket and set room store state
    const socket = connect();
    setRoom(cleanRoomId, name.trim());

    // Join room event emit
    socket.emit('join-room', { room: cleanRoomId, name: name.trim() });
    
    // Redirect to the waiting lobby page
    navigate(`/room/${cleanRoomId}`);
  };

  return (
    <form onSubmit={handleJoin} className="flex flex-col gap-4 p-0 bg-transparent">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold tracking-wide uppercase select-none">
            Your Nickname
          </label>
          <Input
            placeholder="e.g. SudokuNinja"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold tracking-wide uppercase select-none">
            Room Code
          </label>
          <Input
            placeholder="e.g. ABCXYZ"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            maxLength={10}
            required
            disabled={!!initialRoomId}
          />
        </div>
      </div>

      <Button type="submit" variant="outline" className="w-full">
        Join active battle
      </Button>
    </form>
  );
};

export default JoinRoom;
