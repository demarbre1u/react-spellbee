export const isPangram = (word: string) => {
  const letters = new Set(word.split(""));
  return letters.size === 7;
};

export const getRandomIndex = (array: unknown[]) => {
  return Math.floor(Math.random() * array.length);
};
