export const REDUCER = {
  stepwise: ({ matrix, borders }) => ({ type: "stepwise", matrix, borders }),
  edit: ({ location, pattern, matrix }) => ({
    type: "edit",
    location,
    pattern,
    matrix,
  }),
  empty: ({ size }) => ({ type: "empty", size }),
  random: ({ threshold, size }) => ({ type: "random", threshold, size }),
};

export function buildMatrix(reducer) {
  const { type } = reducer;
  switch (type) {
    case "stepwise":
      return buildNextMatrix(reducer, getNextCellState(reducer));
    case "edit":
      return buildNextMatrix(reducer, addPatternToLocation(reducer));
    case "empty":
      return buildEmptyMatrix(reducer);
    case "random":
      return buildRandomMatrix(reducer);
    default:
      return [];
  }
}

function instantiateMatrix(size, initCell) {
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

function buildEmptyMatrix({ size }) {
  return instantiateMatrix(size, () => 0);
}

function buildRandomMatrix({ size, threshold }) {
  return instantiateMatrix(size, () => Number(Math.random() > threshold));
}

function addPatternToLocation({ location: [i, j], pattern }) {
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
  };
}

function buildNextMatrix({ matrix }, getCellState) {
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

function getNextCellState({ borders }) {
  return (i, j, matrix) => {
    const currentState = matrix[i][j];
    const isCurrentlyAlive = currentState === 1;
    const num = countNeighbors(i, j, matrix, borders);

    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

    const isAlive = isCurrentlyAlive ? num === 2 || num === 3 : num === 3;
    return isAlive ? 1 : 0;
  };
}

function countNeighbors(i, j, matrix, borders) {
  const l = matrix.length;
  const l2 = matrix[i].length;
  let yIndices;
  let xIndices;
  if (borders) {
    yIndices = [i - 1, i, i + 1].filter((num) => num >= 0 && num < l);
    xIndices = [j - 1, j, j + 1].filter((num) => num >= 0 && num < l2);
  } else {
    yIndices = [i === 0 ? l - 1 : i - 1, i, (i + 1) % l];
    xIndices = [j === 0 ? l2 - 1 : j - 1, j, (j + 1) % l2];
  }

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
