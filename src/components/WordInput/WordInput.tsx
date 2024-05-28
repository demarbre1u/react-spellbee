import "./WordInput.css";

import { LetterType } from "../../types/letter-type";

type WordInputProps = {
  onSubmit: (event: React.FormEvent) => void;
  value: string;
  setValue: (word: string) => void;
  mandatoryLetter?: LetterType;
  currentLetters: LetterType[];
};

export const WordInput = ({
  onSubmit,
  value,
  setValue,
  mandatoryLetter,
  currentLetters
}: WordInputProps) => {
  return (
    <form action="" onSubmit={onSubmit} className="word-form">
      <input
        type="text"
        name=""
        id="word"
        className="word-form__input"
        onBlur={({ target }) => target.focus()}
        autoFocus={true}
        autoComplete="off"
        value={value}
        onChange={e => setValue(e.target.value)}
      />

      <div className="word-form__display">
        <span className="word-form__display__value">
          {value.split("").map((letter, index) => {
            const formattedLetter = letter.toUpperCase();
            if (letter === mandatoryLetter?.letter) {
              return (
                <span
                  key={index}
                  className="word-form__display__value__letter--mandatory"
                >
                  {formattedLetter}
                </span>
              );
            }

            if (currentLetters.find(l => l.letter === letter)) {
              return (
                <span key={index} className="word-form__display__value__letter">
                  {formattedLetter}
                </span>
              );
            }

            return (
              <span
                key={index}
                className="word-form__display__value__letter--invalid"
              >
                {formattedLetter}
              </span>
            );
          })}
        </span>
        <span className="word-form__display__carret">|</span>
      </div>
    </form>
  );
};
