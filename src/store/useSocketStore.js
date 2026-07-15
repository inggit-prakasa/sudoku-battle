import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  initSocket: () => {
    let s = get().socket;
    if (s) return s;

    // Use current host in production, or let Vite dev server proxy proxy /socket.io in dev.
    s = io({
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5
    });

    s.on('connect', () => {
      set({ isConnected: true });
    });

    s.on('disconnect', () => {
      set({ isConnected: false });
    });

    set({ socket: s });
    return s;
  },

  connect: () => {
    const s = get().initSocket();
    if (!s.connected) {
      s.connect();
    }
    return s;
  },

  disconnect: () => {
    const s = get().socket;
    if (s) {
      s.disconnect();
    }
    set({ isConnected: false });
  }
}));
