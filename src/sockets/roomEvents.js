import { useRoomStore } from '../store/useRoomStore';

export const setupRoomEvents = (socket) => {
  if (!socket) return;

  // Clear existing listeners before setting them up
  socket.off('room-update');
  socket.off('player-joined');
  socket.off('player-left');

  socket.on('room-update', (data) => {
    useRoomStore.getState().updateRoomState(data);
  });

  socket.on('player-joined', (data) => {
    const { name, roomSize } = data;
    useRoomStore.getState().addToast(`${name} joined the lobby (${roomSize} players)`, 'info');
  });

  socket.on('player-left', (data) => {
    const { name } = data;
    useRoomStore.getState().addToast(`${name} left the lobby`, 'warning');
  });
};
