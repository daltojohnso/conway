export function fetchPatternOfTheDay() {
  const patternOfTheDay = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(patternOfTheDay);
    }, 5000 * Math.random());
  });
}
