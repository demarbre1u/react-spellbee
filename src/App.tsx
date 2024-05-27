import { useCallback, useEffect, useRef, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import "./App.css";

const DICT_URL = "/react-spellbee/playable-letters.csv";
const PLAYABLE_LETTERS_DIR = "/react-spellbee/playable-letters-dict";

type Letter = {
  letter: string;
  isMandatory: boolean;
};

function App() {
  const [currentLetters, setCurrentLetters] = useState<Letter[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<Letter[]>([]);
  const [mandatoryLetter, setMandatoryLetter] = useState<Letter>();
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
      `${PLAYABLE_LETTERS_DIR}/${currentLetters
        .map((l) => l.letter)
        .sort()
        .join("")}.csv`
    );

    if (!response.ok) {
      console.error("Error while fetching the playable letters dict file");
      return [];
    }

    const data = await response.text();
    const playableWords = data.split("\n");

    return playableWords;
  }, [currentLetters]);

  const shuffleLetters = (letters: Letter[]) => {
    setShuffledLetters(() => {
      const tmpArray = [...letters];

      for (let i = tmpArray.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [tmpArray[i], tmpArray[rand]] = [tmpArray[rand], tmpArray[i]];
      }

      return tmpArray.filter((l) => !l.isMandatory);
    });
  };

  useEffect(() => {
    (async () => {
      const result = await getPlayableLetters();
      const randomIndex = Math.round(Math.random() * result.length);
      const randomPlayableLetters = result[randomIndex];

      const randomLetterIndex = Math.round(
        Math.random() * randomPlayableLetters.length
      );
      const letters = randomPlayableLetters
        .split("")
        .map((letter, index) => {
          return {
            letter,
            isMandatory: index === randomLetterIndex,
          };
        })
        .sort((a) => (a.isMandatory ? 1 : -1));

      setCurrentLetters(letters);
      shuffleLetters(letters);

      const mandatoryLetter = letters.find((l) => l.isMandatory);
      setMandatoryLetter(mandatoryLetter);
    })();
  }, []);

  useEffect(() => {
    if (!currentLetters.length) {
      return;
    }

    (async () => {
      const result = await getPlayableLettersDictionary();
      const mandatoryLetter =
        currentLetters.find((l) => l.isMandatory)?.letter || "";
      const filteredResult = result.filter((w) => w.includes(mandatoryLetter));
      console.log(filteredResult);

      setPlayableWords(filteredResult);
    })();
  }, [currentLetters, getPlayableLettersDictionary]);

  const submitWord = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wordInput.current?.value) {
      return;
    }

    const word = wordInput.current.value.toLowerCase();

    // If the word contains valid letters
    const regex = new RegExp(
      `^[${currentLetters.map((l) => l.letter).join("")}]+$`
    );
    if (!regex.test(word)) {
      console.log("ne contient pas les bonnes lettres");
      return;
    }

    // If the word is a playable word
    if (!playableWords.includes(word)) {
      console.log("mot pas trouvé");
      wordInput.current.value = "";
      return;
    }

    // If the word contains the mandatory letter
    const mandatoryLetter =
      currentLetters.find((l) => l.isMandatory)?.letter || "";
    if (!word.includes(mandatoryLetter)) {
      console.log("mot ne contient pas la lettre obligatoire");
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

  const removeLetter = () => {
    if (!wordInput.current) {
      return;
    }

    wordInput.current.value = wordInput.current.value.substring(
      0,
      wordInput.current.value.length - 1
    );
  };

  if (!playableWords) {
    return <>loading data...</>;
  }

  return (
    <div className="app-wrapper">
      <div className="left-panel">
        <form action="" onSubmit={submitWord} className="word-form">
          <input
            ref={wordInput}
            type="text"
            name=""
            id="word"
            className="word-form__input"
          />
        </form>
        <div className="letters">
          <div className="letters__row">
            <Letter
              letter={shuffledLetters[0]?.letter}
              onClick={submitLetter}
            />
            <Letter
              letter={shuffledLetters[1]?.letter}
              onClick={submitLetter}
            />
          </div>

          <div className="letters__row">
            <Letter
              letter={shuffledLetters[2]?.letter}
              onClick={submitLetter}
            />
            <Letter
              letter={mandatoryLetter?.letter}
              isMandatory={true}
              onClick={submitLetter}
            />
            <Letter
              letter={shuffledLetters[3]?.letter}
              onClick={submitLetter}
            />
          </div>

          <div className="letters__row">
            <Letter
              letter={shuffledLetters[4]?.letter}
              onClick={submitLetter}
            />
            <Letter
              letter={shuffledLetters[5]?.letter}
              onClick={submitLetter}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-buttons__button" onClick={removeLetter}>
            <FaDeleteLeft />
          </button>
          <button
            className="action-buttons__button"
            onClick={() => shuffleLetters(currentLetters)}
          >
            <GiPerspectiveDiceSixFacesRandom />
          </button>
          <button className="action-buttons__button" onClick={submitWord}>
            <IoSend />
          </button>
        </div>
      </div>

      <div className="right-panel">{wordsPlayed.sort().join(", ")}</div>
    </div>
  );
}

type LetterProps = {
  letter?: string;
  isMandatory?: boolean;
  onClick: (letter: string) => void;
};
const Letter = ({ letter = "", isMandatory, onClick }: LetterProps) => {
  const classes = ["letters__row__letter"];
  if (isMandatory) {
    classes.push("letters__row__letter--mandatory");
  }

  return (
    <div className={classes.join(" ")} onClick={() => onClick(letter)}>
      {letter}
    </div>
  );
};

export default App;
