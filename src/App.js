import React, { useState, useEffect, useCallback} from "react";
import Config from "./Config";
import { CanvasGrid } from "./Grid";

let size = 50;
const initialMatrix = buildRandomMatrix(size);

function App() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [stepCount, setStepCount] = useState(0);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stopped) return;
      const nextMatrix = buildNextMatrix(matrix);
      setMatrix(nextMatrix);
      setStepCount(stepCount + 1);
    }, 100);

    return () => clearInterval(interval);
    });

  const onConfigChange = ({ stopped, stepCount }) => {
    setStopped(stopped);
    setStepCount(stepCount);
  };

  const onFlip = useCallback((i, j) => {
      setMatrix(buildNextMatrix(matrix, flip(i, j)));
  }, [matrix]);

  return (
    <main className="w-screen h-screen">
      <CanvasGrid matrix={matrix} flip={onFlip} />
      <Config config={{ stepCount, stopped }} onChange={onConfigChange} />
    </main>
  );
}

export default App;

function buildRandomMatrix(size) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    matrix.push(row);

    for (let j = 0; j < size; j++) {
      const state = Math.random() > 0.66;
      row.push(state);
    }
  }

  return matrix;
}

function flip (i, j) {
    return (x, y, matrix) => {
        if (i === x && j === y) {
            return !matrix[x][y];
        } else {
             return matrix[x][y];
        }
    }
}

function buildNextMatrix(matrix, getCellState = nextCell) {
  const l = matrix.length;
  const l2 = matrix[0].length;
  const newMatrix = [];
  for (let i = 0; i < l; i++) {
    const row = [];
    newMatrix.push(row);
    for (let j = 0; j < l2; j++) {
      const state = getCellState(i, j, matrix);
      row.push(state);
    }
  }

  return newMatrix;
}

function nextCell(i, j, matrix) {
  const currentState = matrix[i][j];
  const num = countNeighbors(i, j, matrix);

  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  // Any live cell with two or three live neighbours lives on to the next generation.
  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

  // return currentState ? (num === 2 || num === 3) : num === 3;
  const newState = currentState
    ? num === 2 || num === 3
    : num === 3 || (num === 2 && Math.random() > 0.99);
  // return Math.random() > .999 ? !newState : newState;
  return newState;
}

function countNeighbors(i, j, matrix) {
  const l = matrix.length;
  const l2 = matrix[i].length;
  const yIndices = [i - 1, i, i + 1].filter(num => num >= 0 && num < l);
  const xIndices = [j - 1, j, j + 1].filter(num => num >= 0 && num < l2);
  let num = 0;

  for (let ii = 0; ii < yIndices.length; ii++) {
    for (let jj = 0; jj < xIndices.length; jj++) {
      const y = yIndices[ii];
      const x = xIndices[jj];
      if (y === i && x === j) continue;

      if (matrix[y][x]) {
        num += 1;
      }
    }
  }

  return num;
}
