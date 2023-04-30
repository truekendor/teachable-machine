import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import useDebounce from "../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import st from "./TrainingArea.module.css";

type Props = {
    onClick: () => void;
};

function TrainingArea({ onClick }: Props) {
    const { store } = useContext(Context);

    const [warn, setWarn] = useState(false);
    const [inside, setInside] = useState(false);
    const [expandOpt, setExpandOpt] = useState(false);

    const debounce = useDebounce(
        () => {
            if (store.allDataGathered) {
                setWarn(false);
                return;
            }
            setWarn(true);
        },
        500,
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

                <button
                    disabled={store.isModelTrained}
                    className={[st["options-btn"]].join(" ")}
                    onClick={() => {
                        setExpandOpt((prev) => !prev);
                    }}
                >
                    дополнительно
                </button>

                {expandOpt && !store.isModelTrained && (
                    <div className={[st["options"]].join(" ")}>
                        <form className={[st["options-form"]].join(" ")}>
                            <label htmlFor="batch-size">
                                Batch Size
                                <input type="number" id="batch-size" />
                            </label>
                            <label htmlFor="epochs">
                                Количество Эпох
                                <input type="number" id="epochs" />
                            </label>
                            <label htmlFor="shuffle">
                                Перемешивать?
                                <input
                                    defaultChecked
                                    type="checkbox"
                                    id="shuffle"
                                />
                            </label>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default observer(TrainingArea);
