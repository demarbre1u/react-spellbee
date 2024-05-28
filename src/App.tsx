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
  const [wordInput, setWordInput] = useState<string>("");

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
      const randomIndex = Math.floor(Math.random() * result.length);
      const randomPlayableLetters = result[randomIndex];

      const randomLetterIndex = Math.floor(
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

    if (!wordInput) {
      return;
    }

    const word = wordInput.toLowerCase();

    // If the word contains valid letters
    const regex = new RegExp(
      `^[${currentLetters.map((l) => l.letter).join("")}]+$`
    );
    if (!regex.test(word)) {
      showNotification("Mauvaises lettres");
      return;
    }

    // If the word is a playable word
    if (!playableWords.includes(word)) {
      showNotification("Mot inconnu");
      setWordInput("");
      return;
    }

    // If the word contains the mandatory letter
    const mandatoryLetter =
      currentLetters.find((l) => l.isMandatory)?.letter || "";
    if (!word.includes(mandatoryLetter)) {
      showNotification("Lettre manquante obligatoire");
      return;
    }

    // If the word has already been played
    if (wordsPlayed.includes(word)) {
      showNotification("Mot déjà trouvé");
      setWordInput("");
      return;
    }

    if (isPangram(word)) {
      showNotification("Pangramme !", true);
    } else {
      showNotification("Bravo !", true);
    }
    setWordsPlayed((state) => [...state, word]);

    setWordInput("");
  };

  const submitLetter = (letter: string) => {
    setWordInput((word) => word + letter);
  };

  const removeLetter = () => {
    if (!wordInput) {
      return;
    }

    setWordInput((word) => word.substring(0, word.length - 1));
  };

  const isPangram = (word: string) => {
    const letters = new Set(word.split(""));
    return letters.size === 7;
  };

  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [notificationClasses, setNotificationClasses] = useState<string[]>([
    "notification",
    "notification--hide",
  ]);
  const notificationTimeout = useRef<number | null>(null);
  const showNotification = (message: string, isCorrect: boolean = false) => {
    setNotificationMessage(message);

    const classes = ["notification"];
    if (isCorrect) {
      classes.push("notification--correct");
    }

    setNotificationClasses(classes);

    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    notificationTimeout.current = setTimeout(() => {
      setNotificationClasses((classes) => [...classes, "notification--hide"]);
    }, 2000);
  };

  if (!playableWords) {
    return <>loading data...</>;
  }

  return (
    <div className="app-wrapper">
      <div className="left-panel">
        <div className="notification-wrapper">
          <div className={notificationClasses.join(" ")}>
            {notificationMessage || ""}
          </div>
        </div>

        <form action="" onSubmit={submitWord} className="word-form">
          <input
            type="text"
            name=""
            id="word"
            className="word-form__input"
            onBlur={({ target }) => target.focus()}
            autoFocus={true}
            autoComplete="off"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
          />

          <div className="word-form__display">
            <span className="word-form__display__value">
              {wordInput.split("").map((letter, index) => {
                const formattedLetter = letter.toUpperCase();
                if (letter === mandatoryLetter?.letter) {
                  return (
                    <span
                      key={index}
                      className="form__display__value__letter--mandatory"
                    >
                      {formattedLetter}
                    </span>
                  );
                }

                if (currentLetters.find((l) => l.letter === letter)) {
                  return (
                    <span key={index} className="form__display__value__letter">
                      {formattedLetter}
                    </span>
                  );
                }

                return (
                  <span
                    key={index}
                    className="form__display__value__letter--invalid"
                  >
                    {formattedLetter}
                  </span>
                );
              })}
            </span>
            <span className="word-form__display__carret">|</span>
          </div>
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

      <div className="right-panel">
        {wordsPlayed.sort().map((word) => (
          <div
            key={word}
            className={`${isPangram(word) ? "word--pangram" : "word"}`}
          >
            {word}
          </div>
        ))}
      </div>
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
