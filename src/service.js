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
        { id: 1, name: "Foo" },
        { id: 2, name: "Bar" },
      ]);
    }, 2000);
  });
}
