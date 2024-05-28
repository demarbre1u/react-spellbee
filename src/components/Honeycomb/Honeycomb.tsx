import { LetterType } from "../../types/letter-type";
import { Letter } from "../Letter/Letter";
import "./Honeycomb.css";

type HoneycombProps = {
  shuffledLetters: LetterType[];
  submitLetter: (letter: string) => void;
  mandatoryLetter?: LetterType;
};

export const Honeycomb = ({
  shuffledLetters,
  submitLetter,
  mandatoryLetter,
}: HoneycombProps) => {
  return (
    <div className="letters">
      <div className="letters__row">
        <Letter letter={shuffledLetters[0]?.letter} onClick={submitLetter} />
        <Letter letter={shuffledLetters[1]?.letter} onClick={submitLetter} />
      </div>

      <div className="letters__row">
        <Letter letter={shuffledLetters[2]?.letter} onClick={submitLetter} />
        <Letter
          letter={mandatoryLetter?.letter}
          isMandatory={true}
          onClick={submitLetter}
        />
        <Letter letter={shuffledLetters[3]?.letter} onClick={submitLetter} />
      </div>

      <div className="letters__row">
        <Letter letter={shuffledLetters[4]?.letter} onClick={submitLetter} />
        <Letter letter={shuffledLetters[5]?.letter} onClick={submitLetter} />
      </div>
    </div>
  );
};
