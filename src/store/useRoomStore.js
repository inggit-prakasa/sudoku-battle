import { create } from 'zustand';

export const useRoomStore = create((set, get) => ({
  roomName: '',
  playerName: '',
  players: {},
  status: 'waiting', // 'waiting' | 'starting' | 'playing' | 'gameover'
  winner: null,
  totalEmptyCells: 0,
  difficulty: 'medium',
  messages: [],
  countdown: null,
  toasts: [],

  setRoom: (roomName, playerName) => set({ roomName, playerName }),

  updateRoomState: (data) => set({
    status: data.status,
    players: data.players || {},
    totalEmptyCells: data.totalEmptyCells || 0,
    difficulty: data.difficulty || get().difficulty || 'medium'
  }),

  setWinner: (winner) => set({ winner }),

  setCountdown: (countdown) => set({ countdown }),

  addChatMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  })),

  setChatHistory: (messages) => set({ messages: messages || [] }),

  clearRoom: () => set({
    roomName: '',
    playerName: '',
    players: {},
    status: 'waiting',
    winner: null,
    totalEmptyCells: 0,
    difficulty: 'medium',
    messages: [],
    countdown: null
  }),

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  }))
}));
