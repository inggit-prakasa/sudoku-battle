import { useRoomStore } from '../store/useRoomStore';

export const setupRoomEvents = (socket) => {
  if (!socket) return;

  // Clear existing listeners before setting them up
  socket.off('room-update');
  socket.off('player-joined');
  socket.off('player-left');
  socket.off('chat-message');
  socket.off('chat-history');
  socket.off('start-countdown');
  socket.off('start-game-error');

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

  socket.on('chat-message', (data) => {
    useRoomStore.getState().addChatMessage(data);
  });

  socket.on('chat-history', (data) => {
    useRoomStore.getState().setChatHistory(data);
  });

  socket.on('start-countdown', (data) => {
    const { count } = data;
    useRoomStore.getState().setCountdown(count);
    if (count === 0) {
      setTimeout(() => {
        useRoomStore.getState().setCountdown(null);
      }, 1000);
    }
  });

  socket.on('start-game-error', (data) => {
    useRoomStore.getState().addToast(data.message || 'Cannot start game!', 'error');
  });
};
