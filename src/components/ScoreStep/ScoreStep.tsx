import "./ScoreStep.css";

import { GAUGE_WIDTH } from "../../constants";

type ScoreStepProps = {
  step: number;
  currentPercentage: number;
};

export const ScoreStep = ({ step, currentPercentage }: ScoreStepProps) => {
  const stepPosition = GAUGE_WIDTH * (step / 100);

  const classes = ["score-bar__gauge__step"];
  if (step <= currentPercentage) {
    classes.push("score-bar__gauge__step--reached");
  }

  return (
    <div
      style={{ left: `${stepPosition}px` }}
      className={classes.join(" ")}
    ></div>
  );
};
