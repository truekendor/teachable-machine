import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import st from "./TrainingArea.module.css";
import useDebounce from "../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
    onClick: () => void;
};

function TrainingArea({ onClick }: Props) {
    const { store } = useContext(Context);
    const [warn, setWarn] = useState(false);
    const [inside, setInside] = useState(false);

    const debounce = useDebounce(
        () => {
            setWarn(true);
        },
        1000,
        () => {
            setWarn(false);
            return !inside;
        }
    );

    return (
        <div className={[st["container"]].join(" ")}>
            <div className={[st["main-area"]].join(" ")}>
                <h3>Обучение</h3>
                {!store.isModelTrained && (
                    <button
                        className={[
                            st["train-btn"],
                            store.allDataGathered && st["all-gathered"],
                        ].join(" ")}
                        onClick={onClick}
                        onMouseEnter={() => {
                            setInside(true);
                            debounce();
                        }}
                        onMouseLeave={() => {
                            setInside(false);
                            debounce();
                        }}
                    >
                        Обучить модель
                    </button>
                )}
                {warn && (
                    <p className={[st["warn"]].join(" ")}>
                        <FontAwesomeIcon icon={faExclamationCircle} /> Данные
                        собраны не для всех классов
                    </p>
                )}
            </div>
        </div>
    );
}

export default observer(TrainingArea);
