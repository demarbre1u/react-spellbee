import "./ScoreBar.css";

import { GAUGE_WIDTH } from "../../constants";
import { ScoreStep } from "../ScoreStep/ScoreStep";

type ScoreBarProps = {
  score: number;
  maxScore: number;
};

export const ScoreBar = ({ score, maxScore }: ScoreBarProps) => {
  const percentage = Math.round((score / maxScore) * 100);
  const scorePosition = Math.round((GAUGE_WIDTH * score) / maxScore);

  const scoreSteps = [0, 20, 40, 60, 80];

  return (
    <div className="score-bar">
      <div
        className="score-bar__base-score"
        style={{ left: `calc(${scorePosition}px - 20px)` }}
      >
        {score}
      </div>

      <div className="score-bar__gauge" style={{ width: `${GAUGE_WIDTH}px` }}>
        <div
          className="score-bar__gauge__content"
          style={{ width: `${percentage}%` }}
        ></div>

        {scoreSteps.map(step => (
          <ScoreStep key={step} step={step} currentPercentage={percentage} />
        ))}
      </div>

      <div className="score-bar__max-score">{maxScore}</div>
    </div>
  );
};
