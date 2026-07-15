import { useGameStore } from '../store/useGameStore';
import { useRoomStore } from '../store/useRoomStore';

export const setupGameEvents = (socket) => {
  if (!socket) return;

  // Clear existing listeners before setting them up
  socket.off('game-started');
  socket.off('move-result');
  socket.off('game-over');

  socket.on('game-started', (data) => {
    const { puzzle, players, totalEmptyCells } = data;
    
    // Initialize the Sudoku board & start clientside timer
    useGameStore.getState().initGame(puzzle);
    
    // Set Room status to playing
    useRoomStore.getState().updateRoomState({
      status: 'playing',
      players,
      totalEmptyCells
    });
    
    useRoomStore.getState().addToast('The Sudoku Battle has started! Go!', 'info');
  });

  socket.on('move-result', (data) => {
    const { r, c, isCorrect } = data;
    useGameStore.getState().setCellResult(r, c, isCorrect);
    
    if (!isCorrect) {
      useRoomStore.getState().addToast('Incorrect move! That counts as a mistake.', 'error');
    }
  });

  socket.on('game-over', (data) => {
    const { winnerName, players } = data;
    
    // Stop local timer
    useGameStore.getState().stopTimer();
    
    // Set game stats and display game-over overlay
    useRoomStore.getState().setWinner(data);
    useRoomStore.getState().updateRoomState({
      status: 'gameover',
      players
    });

    useRoomStore.getState().addToast(`Game Over! Winner: ${winnerName}`, 'info');
  });
};
