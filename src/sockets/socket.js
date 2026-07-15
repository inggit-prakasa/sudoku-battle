import { setupRoomEvents } from './roomEvents';
import { setupGameEvents } from './gameEvents';

export const initializeSocketListeners = (socket) => {
  if (!socket) return;
  setupRoomEvents(socket);
  setupGameEvents(socket);
};
