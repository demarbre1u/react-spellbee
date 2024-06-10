import { useEffect, useState } from "react";

import { GAME, WORD, WORD_MIN_LENGTH } from "../constants";
import { GameDataType } from "../types/game-data-type";
import { LetterType } from "../types/letter-type";
import { getRandomIndex, getWordScore, isPangram } from "../utils";

const DICT_URL = "/react-spellbee/playable-letters.csv";
const PLAYABLE_LETTERS_DIR = "/react-spellbee/playable-letters-dict";

export const useGame = () => {
  const [gameData, setGameData] = useState<GameDataType>({
    gameState: GAME.LOADING,
    currentLetters: [],
    shuffledLetters: [],
    mandatoryLetter: { letter: "", isMandatory: false },
    playableWords: [],
    wordsPlayed: [],
    currentScore: 0,
    maxScore: 0
  });

  const getPlayableLetters = async () => {
    const response = await fetch(DICT_URL);
    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.text();
    const playableLetters = data.split("\n");

    return playableLetters;
  };

  const getPlayableLettersDictionary = async (letters: LetterType[]) => {
    const response = await fetch(
      `${PLAYABLE_LETTERS_DIR}/${letters
        .map(l => l.letter)
        .sort()
        .join("")}.csv`
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.text();
    const playableWords = data.split("\n");

    return playableWords;
  };

  const shuffleLetters = (letters: LetterType[]) => {
    setGameData(data => {
      const tmpArray = [...letters];

      for (let i = tmpArray.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [tmpArray[i], tmpArray[rand]] = [tmpArray[rand], tmpArray[i]];
      }

      const shuffledLetters = tmpArray.filter(l => !l.isMandatory);

      return { ...data, shuffledLetters };
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const playableLetters = await getPlayableLetters();
        const randomIndex = getRandomIndex(playableLetters);
        const randomPlayableLetters = playableLetters[randomIndex].split("");

        const randomLetterIndex = getRandomIndex(randomPlayableLetters);
        const letters = randomPlayableLetters
          .map((letter, index) => {
            return {
              letter,
              isMandatory: index === randomLetterIndex
            };
          })
          .sort(a => (a.isMandatory ? 1 : -1));

        const mandatoryLetter = letters.find(l => l.isMandatory);

        const dictionary = await getPlayableLettersDictionary(letters);
        const playableWords = dictionary.filter(w =>
          w.includes(mandatoryLetter?.letter || "")
        );

        const score = playableWords.reduce(
          (total, word) => total + getWordScore(word),
          0
        );

        setGameData({
          gameState: GAME.READY,
          currentLetters: letters,
          shuffledLetters: letters,
          mandatoryLetter: mandatoryLetter,
          playableWords: playableWords,
          wordsPlayed: [],
          currentScore: 0,
          maxScore: score
        });

        console.log(
          playableWords.sort((a, b) => getWordScore(b) - getWordScore(a))
        );
      } catch (err) {
        console.error("Error while fetching the playable letters file", err);
        setGameData(data => ({ ...data, gameState: GAME.ERROR }));
      }
    })();
  }, []);

  const validateWord = (word: string) => {
    if (!word) {
      return;
    }

    const currentLetters = gameData.currentLetters;
    const playableWords = gameData.playableWords;
    const wordsPlayed = gameData.wordsPlayed;
    const formattedWord = word.toLowerCase();

    // If the word doesn't contain valid letters
    const regex = new RegExp(
      `^[${currentLetters.map(l => l.letter).join("")}]+$`
    );
    if (!regex.test(formattedWord)) {
      return WORD.INVALID_LETTERS;
    }

    if (formattedWord.length < WORD_MIN_LENGTH) {
      return WORD.WORD_TOO_SHORT;
    }

    // If the word is not a playable word
    if (!playableWords.includes(formattedWord)) {
      return WORD.NOT_FOUND;
    }

    // If the word doesn't contain the mandatory letter
    const mandatoryLetter =
      currentLetters.find(l => l.isMandatory)?.letter || "";
    if (!formattedWord.includes(mandatoryLetter)) {
      return WORD.MANDATORY_LETTER_MISSING;
    }

    // If the word has already been played
    if (wordsPlayed.includes(formattedWord)) {
      return WORD.ALREADY_PLAYED;
    }

    if (isPangram(formattedWord)) {
      return WORD.PANGRAM;
    } else {
      return WORD.CORRECT;
    }
  };

  const setWordPlayed = (word: string) => {
    setGameData(data => ({
      ...data,
      wordsPlayed: [...data.wordsPlayed, word]
    }));
  };

  const setCurrentScore = (score: number) => {
    setGameData(data => ({
      ...data,
      currentScore: data.currentScore + score
    }));
  };

  return {
    ...gameData,
    shuffleLetters,
    validateWord,
    setWordPlayed,
    setCurrentScore
  };
};
