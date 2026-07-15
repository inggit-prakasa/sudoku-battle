import React from 'react';
import { cn } from '../../lib/utils';

export const SudokuCell = ({
  value,
  isGiven,
  isSelected,
  isSameNumber,
  isHighlightLine,
  isError,
  isConflict,
  onClick
}) => {
  const displayVal = value && value !== 0 ? value : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex justify-center items-center aspect-square text-base sm:text-xl font-bold cursor-pointer transition-colors duration-100 select-none",
        // Base backgrounds based on given vs. editable
        isGiven ? "bg-accent-light text-main font-extrabold cursor-not-allowed" : "bg-card text-primary",
        
        // Highlights (in ascending order of priority)
        {
          "bg-accent-highlight": isHighlightLine && !isGiven,
          "bg-primary-light text-main": isSameNumber && !isSelected && !isGiven,
          "bg-accent-select text-main ring-2 ring-primary ring-inset": isSelected,
          "bg-accent-error text-accent-errorText": isError || isConflict,
        }
      )}
    >
      {displayVal}
    </div>
  );
};
export default SudokuCell;
