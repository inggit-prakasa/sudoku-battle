import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  puzzle: null,
  board: null,
  given: null,
  errors: null,
  selectedCell: null,
  timerSeconds: 0,
  timerInterval: null,

  initGame: (puzzle) => {
    // Clear any existing timer
    const currentInterval = get().timerInterval;
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    const board = JSON.parse(JSON.stringify(puzzle));
    const given = puzzle.map((row) => row.map((cell) => cell !== 0));
    const errors = Array(9).fill(null).map(() => Array(9).fill(false));

    // Start a client-side timer
    const interval = setInterval(() => {
      set((state) => ({ timerSeconds: state.timerSeconds + 1 }));
    }, 1000);

    set({
      puzzle,
      board,
      given,
      errors,
      selectedCell: null,
      timerSeconds: 0,
      timerInterval: interval
    });
  },

  selectCell: (r, c) => {
    set({ selectedCell: { r, c } });
  },

  setCellValue: (r, c, val, socket) => {
    const { board, given, errors } = get();
    if (!board || given[r][c]) return;

    // Create a new board with the updated cell
    const newBoard = board.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );

    // Clear error for this cell since user is editing it
    const newErrors = errors.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? false : cell))
    );

    set({ board: newBoard, errors: newErrors });

    // Only submit to server if setting a non-zero number.
    // If val is 0 (cleared), we just update the client-side board.
    if (val >= 1 && val <= 9) {
      if (socket) {
        socket.emit('submit-cell', { r, c, val });
      }
    }
  },

  setCellResult: (r, c, isCorrect) => {
    const { errors } = get();
    if (!errors) return;

    const newErrors = errors.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? !isCorrect : cell))
    );

    set({ errors: newErrors });
  },

  stopTimer: () => {
    const currentInterval = get().timerInterval;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    set({ timerInterval: null });
  },

  resetGameStore: () => {
    const currentInterval = get().timerInterval;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    set({
      puzzle: null,
      board: null,
      given: null,
      errors: null,
      selectedCell: null,
      timerSeconds: 0,
      timerInterval: null
    });
  }
}));
