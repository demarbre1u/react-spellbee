import { useEffect, useState } from "react";

import { GAME, WORD } from "../constants";
import { LetterType } from "../types/letter-type";
import { getRandomIndex, isPangram } from "../utils";

const DICT_URL = "/react-spellbee/playable-letters.csv";
const PLAYABLE_LETTERS_DIR = "/react-spellbee/playable-letters-dict";

export const useGame = () => {
  const [gameState, setGameState] = useState<string>(GAME.LOADING);
  const [currentLetters, setCurrentLetters] = useState<LetterType[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<LetterType[]>([]);
  const [mandatoryLetter, setMandatoryLetter] = useState<LetterType>();
  const [playableWords, setPlayableWords] = useState<string[]>([]);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);

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
    setShuffledLetters(() => {
      const tmpArray = [...letters];

      for (let i = tmpArray.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [tmpArray[i], tmpArray[rand]] = [tmpArray[rand], tmpArray[i]];
      }

      return tmpArray.filter(l => !l.isMandatory);
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

        setCurrentLetters(letters);
        shuffleLetters(letters);

        const mandatoryLetter = letters.find(l => l.isMandatory);
        setMandatoryLetter(mandatoryLetter);

        const dictionary = await getPlayableLettersDictionary(letters);
        const filteredResult = dictionary.filter(w =>
          w.includes(mandatoryLetter?.letter || "")
        );

        console.log(filteredResult);

        setPlayableWords(filteredResult);

        setGameState(GAME.READY);
      } catch (err) {
        console.error("Error while fetching the playable letters file", err);
        setGameState(GAME.ERROR);
      }
    })();
  }, []);

  const validateWord = (word: string) => {
    if (!word) {
      return;
    }

    const formattedWord = word.toLowerCase();

    // If the word doesn't contain valid letters
    const regex = new RegExp(
      `^[${currentLetters.map(l => l.letter).join("")}]+$`
    );
    if (!regex.test(formattedWord)) {
      return WORD.INVALID_LETTERS;
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

  return {
    gameState,
    validateWord,
    currentLetters,
    mandatoryLetter,
    shuffledLetters,
    shuffleLetters,
    wordsPlayed,
    setWordsPlayed
  };
};
