import "./WorList.css";

import { DICTIONARY_URL } from "../../constants";
import { isPangram } from "../../utils";

type WordListProps = {
  wordsPlayed: string[];
};

export const WordList = ({ wordsPlayed = [] }: WordListProps) => {
  return (
    <div className="word-list">
      <div className="word-list__title">Mots trouvés</div>

      <div className="word-list__list">
        {wordsPlayed.sort().map(word => (
          <a
            href={`${DICTIONARY_URL}/${word}`}
            key={word}
            target="_blank"
            className={`${isPangram(word) ? "word-list__list__word--pangram" : "word-list__list__word"}`}
          >
            {word}
          </a>
        ))}
      </div>
    </div>
  );
};
