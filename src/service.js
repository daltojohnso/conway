// returns a Promise that eventually resolves to a "pattern"
export function fetchPatternOfTheDay() {
  const patternOfTheDay = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(patternOfTheDay);
    }, 2000);
  });
}

// returns a Promise that eventually resolves to a list of "Friend" objects
export function fetchFriends() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "John Conway", favoritePattern: 123 },
        { id: 3, name: "Murray Gell-Mann", favoritePattern: undefined },
        { id: 4, name: "Mary Cartwright", favoritePattern: 456 },
      ]);
    }, 2000);
  });
}

// returns a Promise that eventually resolves to the pattern with the given ID
// if no matching pattern found resolves to undefined
export function fetchPattern(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pattern = {
        123: [
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 0],
        ],
        456: [
          [0, 1, 0],
          [0, 0, 1],
          [1, 1, 1],
        ],
        789: [
          [1, 1],
          [1, 1],
        ],
      }[id];

      resolve(pattern);
    }, 2000);
  });
}
