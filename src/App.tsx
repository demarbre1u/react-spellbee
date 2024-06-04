import { FaDeleteLeft } from "react-icons/fa6";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { IoSend } from "react-icons/io5";

import "./App.css";

import { Button } from "./components/Button/Button";
import { Honeycomb } from "./components/Honeycomb/Honeycomb";
import { Notification } from "./components/Notification/Notification";
import { ScoreBar } from "./components/ScoreBar/ScoreBar";
import { WordInput } from "./components/WordInput/WordInput";
import { WordList } from "./components/WordList/WordList";
import { GAME, WORD } from "./constants";
import { useGame } from "./hooks/useGame";
import { useInput } from "./hooks/useInput";
import { useNotification } from "./hooks/useNotification";
import { getWordScore } from "./utils";

function App() {
  const {
    gameState,
    validateWord,
    currentLetters,
    mandatoryLetter,
    shuffledLetters,
    shuffleLetters,
    wordsPlayed,
    setWordPlayed,
    maxScore,
    currentScore,
    setCurrentScore
  } = useGame();
  const { notificationOptions, showNotification } = useNotification();
  const { value, setValue, removeLetter } = useInput();

  const submitWord = (e: React.FormEvent) => {
    e.preventDefault();

    let wordScore = 0;
    const formattedValue = value.toLowerCase();
    switch (validateWord(formattedValue)) {
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
        wordScore = getWordScore(formattedValue);
        showNotification(`Bravo ! +${wordScore}`, true);
        setValue("");
        setWordPlayed(formattedValue);
        setCurrentScore(wordScore);
        break;
      case WORD.PANGRAM:
        wordScore = getWordScore(formattedValue);
        showNotification(`Pangramme ! +${wordScore}`, true);
        setValue("");
        setWordPlayed(formattedValue);
        setCurrentScore(wordScore);
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
            <ScoreBar score={currentScore} maxScore={maxScore} />

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
              submitLetter={letter => setValue(word => word + letter)}
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
            <WordList wordsPlayed={wordsPlayed} />
          </div>
        </div>
      );
  }
}

export default App;
