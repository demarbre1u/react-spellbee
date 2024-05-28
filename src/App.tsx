import { FaDeleteLeft } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Button } from "./components/Button/Button";
import { WordInput } from "./components/WordInput/WordInput";
import { Honeycomb } from "./components/Honeycomb/Honeycomb";
import { Notification } from "./components/Notification/Notification";
import { useNotification } from "./hooks/useNotification";
import { isPangram } from "./utils";
import { useInput } from "./hooks/useInput";
import { useGame } from "./hooks/useGame";
import { GAME, WORD } from "./constants";
import "./App.css";

function App() {
  const {
    gameState,
    validateWord,
    currentLetters,
    mandatoryLetter,
    shuffledLetters,
    shuffleLetters,
    wordsPlayed,
    setWordsPlayed,
  } = useGame();
  const { notificationOptions, showNotification } = useNotification();
  const { value, setValue, removeLetter } = useInput();

  const submitWord = (e: React.FormEvent) => {
    e.preventDefault();

    switch (validateWord(value)) {
      case WORD.INVALID_LETTERS:
        showNotification("Mauvaises lettres");
        break;
      case WORD.NOT_FOUND:
        showNotification("Mot inconnu");
        setValue("");
        break;
      case WORD.MANDATORY_LETTER_MISSING:
        showNotification("Lettre manquante obligatoire");
        break;
      case WORD.ALREADY_PLAYED:
        showNotification("Mot déjà trouvé");
        setValue("");
        break;
      case WORD.CORRECT:
        showNotification("Bravo !", true);
        setValue("");
        setWordsPlayed((words) => [...words, value.toLowerCase()]);
        break;
      case WORD.PANGRAM:
        showNotification("Pangramme !", true);
        setValue("");
        setWordsPlayed((words) => [...words, value.toLowerCase()]);
        break;
    }
  };

  switch (gameState) {
    case GAME.LOADING:
      return <>game loading...</>;
    case GAME.ERROR:
      return <>an error occured</>;
    case GAME.READY:
      return (
        <div className="app-wrapper">
          <div className="left-panel">
            <Notification {...notificationOptions} />

            <WordInput
              onSubmit={submitWord}
              value={value}
              setValue={setValue}
              currentLetters={currentLetters}
              mandatoryLetter={mandatoryLetter}
            />

            <Honeycomb
              shuffledLetters={shuffledLetters}
              mandatoryLetter={mandatoryLetter}
              submitLetter={(letter) => setValue((word) => word + letter)}
            />

            <div className="action-buttons">
              <Button icon={<FaDeleteLeft />} onClick={removeLetter} />
              <Button
                icon={<GiPerspectiveDiceSixFacesRandom />}
                onClick={() => shuffleLetters(currentLetters)}
              />
              <Button icon={<IoSend />} onClick={submitWord} />
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
}

export default App;
