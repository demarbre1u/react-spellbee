import "./ScoreBar.css";

type ScoreBarProps = {
  score: number;
  maxScore: number;
};

export const ScoreBar = ({ score, maxScore }: ScoreBarProps) => {
  const getGaugeWidth = () => {
    const percentage = Math.round((score / maxScore) * 100);
    return `${percentage}%`;
  };

  return (
    <div className="score-bar">
      <div className="score-bar__base-score">{score}</div>

      <div className="score-bar__gauge">
        <div
          className="score-bar__gauge__content"
          style={{ width: getGaugeWidth() }}
        ></div>
      </div>

      <div className="score-bar__max-score">{maxScore}</div>
    </div>
  );
};
