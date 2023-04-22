import React from "react";
import st from "./NewCardBtn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

interface Props {
    onClick: () => void;
    hidden: boolean;
}

export default function NewCardBtn({ onClick, hidden }: Props) {
    return (
        <button
            onClick={onClick}
            className={[
                st["new-card-btn"],
                hidden && st["visually-hidden"],
            ].join(" ")}
        >
            <FontAwesomeIcon className={`${st["icon"]}`} icon={faPlusSquare} />
            Добавить класс
        </button>
    );
}
