import React, { useState, useEffect, useCallback} from "react";
import Config from "./Config";
import CanvasGrid from "./Grid";
import Catalogue from './Catalogue';

// use a state chart for defining more freely the living/dead thing?

let size = 50;
const initialMatrix = buildRandomMatrix(size);

function App() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [stepCount, setStepCount] = useState(1);
  const [stopped, setStopped] = useState(false);
  const [isDrawing, setIsDrawing] = useState(true);
  const [dead, setDead] = useState(false);
  const [pattern, setPattern] = useState([[1]]);

  useEffect(() => {
    const interval = setInterval(() => {
        if (stopped || dead) return;
        const [nextMatrix, isDead] = buildNextMatrix(matrix);
        setMatrix(nextMatrix);
        if (isDead) setDead(isDead);
        setStepCount(stepCount + 1);
    }, 100);

    return () => clearInterval(interval);
  });

  const onConfigChange = useCallback(({ action }) => {
      if (dead) setDead(false);

      switch (action) {
        case 'stop':
            setStopped(true);
            break;
        case 'start':
            setStopped(false);
            break;
        case 'restart':
            setMatrix(buildRandomMatrix(size));
            setStepCount(1);
            break;
        case 'clear':
            setMatrix(buildEmptyMatrix(size));
            setStepCount(1);
            setDead(true);
            break;
        case 'drawmode:on':
            setIsDrawing(true);
            break;
        case 'drawmode:off':
            setIsDrawing(false);
            break;
        default:
            break;
      }
  }, [dead]);
  const onGridClick = useCallback((xy, pattern) => {
      const [m, isDead] = buildNextMatrix(matrix, buildPattern(xy, pattern))
      setMatrix(m);
      setDead(isDead);
  }, [matrix]);

  const onCatalogueClick = useCallback(({pattern}) => {
      setPattern(pattern);
  }, []);

  return (
    <main className="p-4 w-screen h-screen grid grid-cols-2 gap-4 bg-gray-200">
        <div className="">
            <h1 className="inline-block px-4 mb-3 text-4xl bg-gray-100 shadow-md">
                Conway's Game of Life
            </h1>
            <div className="bg-gray-100 shadow-md mb-3">
                <Config config={{ stepCount, stopped, isDrawing }} onChange={onConfigChange} />
            </div>
            <div className="bg-gray-100 shadow-md">
                <Catalogue onClick={onCatalogueClick} />
            </div>
        </div>
        <div className="flex flex-col justify-center items-center">
             <div style={{minWidth: 750}} className="p-4 bg-gray-100 shadow-lg">
                  <CanvasGrid
                      matrix={matrix}
                      pattern={pattern}
                      onClick={onGridClick}
                      size={15}
                      isDrawing={isDrawing} />
             </div>
        </div>
    </main>
  );
}

export default App;

function buildMatrix (size, initCell) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      matrix.push(row);

      for (let j = 0; j < size; j++) {
        row.push(initCell(i, j));
      }
    }

    return matrix;
}

function buildEmptyMatrix (size) {
    return buildMatrix(size, () => false);
}

function buildRandomMatrix (size) {
    return buildMatrix(size, () => Math.random() > 0.66);
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

function buildPattern ([i, j], pattern) {
    return (x, y, matrix) => {
        if (i === x && j === y) {
            pattern.forEach((row, iP) => {
                const ix = iP + x;
                row.forEach((state, jP) => {
                    const jy = jP + y;
                    if (matrix[ix] != null && matrix[jy] != null) {
                        matrix[ix][jy] = state;
                    }
                });
            });
        }

        return matrix[x][y];
    }
}

function buildNextMatrix(matrix, getCellState = nextCell) {
  const l = matrix.length;
  const l2 = matrix[0].length;
  const newMatrix = [];
  let isDead = true;
  for (let i = 0; i < l; i++) {
    const row = [];
    newMatrix.push(row);
    for (let j = 0; j < l2; j++) {
      const state = getCellState(i, j, matrix);
      if (state) isDead = false;
      row.push(state);
    }
  }

  return [newMatrix, isDead];
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
    : num === 3; // || (num === 2 && Math.random() > 0.99);
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
