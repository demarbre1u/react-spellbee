import { PANGRAM_SCORE, WORD_MIN_LENGTH } from "./constants";

export const isPangram = (word: string) => {
  const letters = new Set(word.split(""));
  return letters.size === 7;
};

export const getRandomIndex = (array: unknown[]) => {
  return Math.floor(Math.random() * array.length);
};

export const getWordScore = (word: string) => {
  let score = 1 + word.length - WORD_MIN_LENGTH;
  if (isPangram(word)) {
    score += PANGRAM_SCORE;
  }

  return score;
};
