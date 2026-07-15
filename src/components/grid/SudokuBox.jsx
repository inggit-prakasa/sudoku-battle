import React from 'react';

export const SudokuBox = ({ children }) => {
  return (
    <div className="grid grid-cols-3 gap-[1px] bg-neutral-200 border-3 border-main overflow-hidden">
      {children}
    </div>
  );
};

export default SudokuBox;
