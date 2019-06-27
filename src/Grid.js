import React from 'react';
import Cell from './Cell';

const Grid = ({matrix}) => {
  const grid = matrix.map((row, i) => {
    return (
      <div className="flex flex-row" key={i}>
        {row.map((alive, j) => <Cell alive={alive} key={j} />)}
      </div>
    )
  });
  return <div className="flex flex-col">{grid}</div>;
};

export default Grid;
