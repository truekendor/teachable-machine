import { useContext, useState } from "react";
import { Context } from "../../index";

import st from "./TrainingOptions.module.css";
import { observer } from "mobx-react-lite";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExclamationCircle,
    faHistory,
} from "@fortawesome/free-solid-svg-icons";

function TrainingOptions() {
    const { store } = useContext(Context);

    const [epochsValue, setEpochsValue] = useState("20");

    const isAdam = store.trainingOptions.optimizer === "adam";

    // ! возможны ошибке при выборе
    // const length = store.base64Array.flat().length;

    return (
        <div className={[st["options"]].join(" ")}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className={[st["options-form"]].join(" ")}
            >
                <DropDownMenu
                    list={["Adam", "SGD"]}
                    onChoose={(value) => {
                        type T = "adam" | "sgd";
                        value = value.toLocaleLowerCase();

                        store.setTrainingOptions({ optimizer: value as T });
                    }}
                    title="Оптимизатор"
                />
                <DropDownMenu
                    list={["0%", "5%", "10%", "15%"]}
                    onChoose={(value) => {
                        let num = parseInt(value);
                        num /= 100;

                        store.setTrainingOptions({ validationSplit: num });
                    }}
                    title="Валидация"
                />

                <DropDownMenu
                    list={["16", "32", "64", "128", "256", "512"]}
                    onChoose={(value) => {
                        let num = parseInt(value);

                        store.setTrainingOptions({ batchSize: num });
                    }}
                    title="Размер пакета"
                />

                <label className={st["label"]} htmlFor="epochs">
                    <h4>Количество Эпох</h4>
                    <input
                        className={st["epochs-input"]}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setEpochsValue("");
                                return;
                            }
                            let val = parseInt?.(e.target.value);

                            if (val === 0 || val > 999) return;

                            setEpochsValue(`${val}`);
                            store.setTrainingOptions({
                                epochs: val,
                            });
                        }}
                        value={epochsValue}
                        min={1}
                        type="number"
                        id="epochs"
                    />
                </label>

                <label className={st["label"]} htmlFor="learning-rate">
                    <h4>Скорость обучения?</h4>
                    <input
                        disabled={isAdam}
                        className={[isAdam ? st["stroked"] : ""].join(" ")}
                        defaultValue={0.001}
                        type="text"
                        id="learning-rate"
                    />
                    {isAdam && (
                        <div className={[st["adam-warn"]].join(" ")}>
                            <FontAwesomeIcon icon={faExclamationCircle} /> Adam
                            автоматически выбирает скорость обучения
                        </div>
                    )}
                </label>
                <button
                    onClick={() => {
                        store.setTrainingOptions({
                            ...store.defaultTrainingOptions,
                        });
                    }}
                    className={st["default-btn"]}
                >
                    Сбросить настройки <FontAwesomeIcon icon={faHistory} />
                </button>
            </form>
        </div>
    );
}

export default observer(TrainingOptions);
