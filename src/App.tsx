import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const DICT_URL = "/react-spellbee/playable-letters.csv";
const PLAYABLE_LETTERS_DIR = "/react-spellbee/playable-letters-dict";

function App() {
  const [currentLetters, setCurrentLetters] = useState<string[]>([]);
  const [playableWords, setPlayableWords] = useState<string[]>([]);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);

  const wordInput = useRef<HTMLInputElement | null>(null);

  const getPlayableLetters = async () => {
    const response = await fetch(DICT_URL);
    if (!response.ok) {
      console.error("Error while fetching the playable letters file");
      return [];
    }

    const data = await response.text();
    const playableLetters = data.split("\n");

    return playableLetters || [];
  };

  const getPlayableLettersDictionary = useCallback(async () => {
    const response = await fetch(
      `${PLAYABLE_LETTERS_DIR}/${currentLetters.join("")}.csv`
    );

    if (!response.ok) {
      console.error("Error while fetching the playable letters dict file");
      return [];
    }

    const data = await response.text();
    const playableWords = data.split("\n");

    return playableWords;
  }, [currentLetters]);

  useEffect(() => {
    (async () => {
      const result = await getPlayableLetters();
      const randomIndex = Math.round(Math.random() * result.length);
      const randomPlayableLetters = result[randomIndex];

      setCurrentLetters(randomPlayableLetters.split(""));
    })();
  }, []);

  useEffect(() => {
    if (!currentLetters.length) {
      return;
    }

    (async () => {
      const result = await getPlayableLettersDictionary();
      setPlayableWords(result);
      console.log(result);
    })();
  }, [currentLetters, getPlayableLettersDictionary]);

  const submitWord = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wordInput.current?.value) {
      return;
    }

    const word = wordInput.current.value;

    // If the word contains valid letters
    const regex = new RegExp(`^[${currentLetters}]+$`);
    if (!regex.test(word)) {
      console.log("ne contient pas les bonnes lettres");
      return;
    }

    // If the word is a playable word
    if (!playableWords.includes(word)) {
      console.log("mot invalide");
      wordInput.current.value = "";
      return;
    }

    // If the word has already been played
    if (wordsPlayed.includes(word)) {
      console.log("déjà joué");
      wordInput.current.value = "";
      return;
    }

    console.log("mot valide");
    setWordsPlayed((state) => [...state, word]);

    wordInput.current.value = "";
  };

  const submitLetter = (letter: string) => {
    if (!wordInput.current) {
      return;
    }

    wordInput.current.value += letter;
  };

  if (!playableWords) {
    return <>loading data...</>;
  }

  return (
    <div className="app-wrapper">
      <div className="left-panel">
        <div className="letters">
          <div className="letters__row">
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[0])}
            >
              {currentLetters[0]}
            </div>
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[1])}
            >
              {currentLetters[1]}
            </div>
          </div>

          <div className="letters__row">
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[2])}
            >
              {currentLetters[2]}
            </div>
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[3])}
            >
              {currentLetters[3]}
            </div>
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[4])}
            >
              {currentLetters[4]}
            </div>
          </div>

          <div className="letters__row">
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[5])}
            >
              {currentLetters[5]}
            </div>
            <div
              className="letters__row__letter"
              onClick={() => submitLetter(currentLetters[6])}
            >
              {currentLetters[6]}
            </div>
          </div>
        </div>

        <form action="" onSubmit={submitWord} className="word-form">
          <input
            ref={wordInput}
            type="text"
            name=""
            id="word"
            className="word-form__input"
          />
        </form>
      </div>

      <div className="right-panel">{wordsPlayed.sort().join(", ")}</div>
    </div>
  );
}

export default App;
