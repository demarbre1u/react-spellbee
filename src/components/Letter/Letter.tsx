import "./Letter.css";

type LetterProps = {
    letter?: string;
    isMandatory?: boolean;
    onClick: (letter: string) => void;
};

export const Letter = ({ letter = "", isMandatory, onClick }: LetterProps) => {
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
