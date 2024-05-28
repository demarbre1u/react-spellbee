import { ReactNode } from "react";

import "./Button.css";

type ButtonProps = {
    icon: ReactNode;
    onClick: (event: React.MouseEvent) => void;
};

export const Button = ({ icon, onClick }: ButtonProps) => {
    return (
        <button className="action-buttons__button" onClick={e => onClick(e)}>
            {icon}
        </button>
    );
};
