import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '../../store/useSocketStore';
import { useRoomStore } from '../../store/useRoomStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const CreateRoom = () => {
  const [name, setName] = useState('');
  const connect = useSocketStore((state) => state.connect);
  const setRoom = useRoomStore((state) => state.setRoom);
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate a random 6-character room code
    const generatedRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Connect socket and set room store state
    const socket = connect();
    setRoom(generatedRoomId, name.trim());

    // Join room event emit
    socket.emit('join-room', { room: generatedRoomId, name: name.trim() });
    
    // Redirect to the waiting lobby page
    navigate(`/room/${generatedRoomId}`);
  };

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-4 p-0 bg-transparent">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold tracking-wide uppercase select-none">
          Your Nickname
        </label>
        <Input
          placeholder="e.g. MasterSudoku"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={15}
          required
        />
      </div>
      <Button type="submit" variant="default" className="w-full">
        Create new battle room
      </Button>
    </form>
  );
};

export default CreateRoom;
