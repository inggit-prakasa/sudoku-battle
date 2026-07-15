/**
 * Checks a Sudoku board and returns a Set of coordinate strings "row,col"
 * that represent cells currently in conflict (duplicate numbers in the same
 * row, column, or 3x3 block).
 */
export function getSudokuConflicts(board) {
  if (!board) return new Set();
  const conflicts = new Set();

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = parseInt(board[r][c]);
      if (!val || val === 0) continue;

      // 1. Check Row conflicts
      for (let col = 0; col < 9; col++) {
        if (col !== c && parseInt(board[r][col]) === val) {
          conflicts.add(`${r},${c}`);
          conflicts.add(`${r},${col}`);
        }
      }

      // 2. Check Column conflicts
      for (let row = 0; row < 9; row++) {
        if (row !== r && parseInt(board[row][c]) === val) {
          conflicts.add(`${r},${c}`);
          conflicts.add(`${row},${c}`);
        }
      }

      // 3. Check 3x3 Box conflicts
      const startRow = Math.floor(r / 3) * 3;
      const startCol = Math.floor(c / 3) * 3;
      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          if ((row !== r || col !== c) && parseInt(board[row][col]) === val) {
            conflicts.add(`${r},${c}`);
            conflicts.add(`${row},${col}`);
          }
        }
      }
    }
  }

  return conflicts;
}
