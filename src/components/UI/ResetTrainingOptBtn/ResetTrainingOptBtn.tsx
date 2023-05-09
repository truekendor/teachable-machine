import React from "react";

import st from "./ResetTrainingOptBtn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";

type Props = {
    onClick: () => void;
};

export default function ResetTrainingOptBtn({ onClick }: Props) {
    return (
        <button type="button" className={st["button"]} onClick={onClick}>
            Сбросить настройки <FontAwesomeIcon icon={faHistory} />
        </button>
    );
}
