import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useSocketStore } from '../../store/useSocketStore';
import { getSudokuConflicts } from '../../lib/sudokuValidator';
import SudokuBox from './SudokuBox';
import SudokuCell from './SudokuCell';

export const SudokuGrid = () => {
  const board = useGameStore((state) => state.board);
  const given = useGameStore((state) => state.given);
  const errors = useGameStore((state) => state.errors);
  const selectedCell = useGameStore((state) => state.selectedCell);
  const selectCell = useGameStore((state) => state.selectCell);
  const setCellValue = useGameStore((state) => state.setCellValue);
  
  const socket = useSocketStore((state) => state.socket);

  // Compute clientside cell conflicts
  const conflicts = getSudokuConflicts(board);

  // Handle keyboard inputs and navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell || !board) return;
      const { r, c } = selectedCell;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (r > 0) selectCell(r - 1, c);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (r < 8) selectCell(r + 1, c);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (c > 0) selectCell(r, c - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (c < 8) selectCell(r, c + 1);
      } else if (e.key >= '1' && e.key <= '9') {
        const val = parseInt(e.key);
        setCellValue(r, c, val, socket);
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setCellValue(r, c, 0, socket);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, board, selectCell, setCellValue, socket]);

  if (!board) return null;

  // Selected cell helper details
  const selectedValue = selectedCell ? board[selectedCell.r][selectedCell.c] : null;

  // Render the 9 boxes (each box contains 9 cells)
  return (
    <div className="grid grid-cols-3 gap-1 bg-main border-3 border-main w-full max-w-[420px] aspect-square shadow-flat-sm overflow-hidden select-none">
      {Array.from({ length: 9 }).map((_, boxIdx) => {
        const rowOffset = Math.floor(boxIdx / 3) * 3;
        const colOffset = (boxIdx % 3) * 3;

        return (
          <SudokuBox key={boxIdx}>
            {Array.from({ length: 9 }).map((__, cellIdx) => {
              const r = rowOffset + Math.floor(cellIdx / 3);
              const c = colOffset + (cellIdx % 3);
              
              const val = board[r][c];
              const isCellGiven = given[r][c];
              const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
              
              // Same number highlight
              const isSameNumber = selectedValue && selectedValue !== 0 && val === selectedValue;
              
              // Line highlight (same row, col, or block as selected cell)
              const isHighlightLine = selectedCell && (
                selectedCell.r === r ||
                selectedCell.c === c ||
                (Math.floor(selectedCell.r / 3) === Math.floor(r / 3) &&
                 Math.floor(selectedCell.c / 3) === Math.floor(c / 3))
              );

              const isError = errors[r][c];
              const isConflict = conflicts.has(`${r},${c}`);

              return (
                <SudokuCell
                  key={cellIdx}
                  value={val}
                  isGiven={isCellGiven}
                  isSelected={isSelected}
                  isSameNumber={isSameNumber}
                  isHighlightLine={isHighlightLine}
                  isError={isError}
                  isConflict={isConflict}
                  onClick={() => selectCell(r, c)}
                />
              );
            })}
          </SudokuBox>
        );
      })}
    </div>
  );
};

export default SudokuGrid;
