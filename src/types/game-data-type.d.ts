export type GameDataType = {
  gameState: string;
  currentLetters: LetterType[];
  shuffledLetters: LetterType[];
  mandatoryLetter?: LetterType;
  playableWords: string[];
  wordsPlayed: string[];
  currentScore: number;
  maxScore: number;
};
