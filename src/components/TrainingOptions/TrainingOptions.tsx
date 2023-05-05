import { useContext, useState } from "react";
import { Context } from "../../index";

import st from "./TrainingOptions.module.css";
import { observer } from "mobx-react-lite";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExclamationCircle,
    faHistory,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { infoText } from "../../utils/infoText";

function TrainingOptions() {
    const { store } = useContext(Context);

    const [epochsValue, setEpochsValue] = useState("20");
    const [learningRate, setLearningRate] = useState(
        `${store.trainingOptions.learningRate}`
    );

    const isAdam = store.trainingOptions.optimizer === "adam";

    return (
        <div className={[st["options"]].join(" ")}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className={[st["options-form"]].join(" ")}
            >
                <DropDownMenu
                    list={["adam", "sgd"]}
                    onChoose={(value) => {
                        type T = "adam" | "sgd";
                        value = value.toLocaleLowerCase();

                        store.setTrainingOptions({ optimizer: value as T });
                    }}
                    propName={"optimizer"}
                    title="Оптимизатор"
                    helpText={infoText.optimizer}
                />
                <DropDownMenu
                    list={["0%", "10%", "15%", "20%"]}
                    onChoose={(value) => {
                        let num = parseInt(value);
                        num /= 100;

                        store.setTrainingOptions({ validationSplit: num });
                    }}
                    propName={`validationSplit`}
                    title="Валидация"
                    helpText={infoText.validationSplit}
                />

                <DropDownMenu
                    list={["16", "32", "64", "128", "256", "512"]}
                    onChoose={(value) => {
                        let num = parseInt(value);

                        store.setTrainingOptions({ batchSize: num });
                    }}
                    propName={"batchSize"}
                    title="Размер пакета"
                    helpText={infoText.batchSize}
                />

                <label className={st["label"]} htmlFor="epochs">
                    <h4 className={st["header"]}>Количество Эпох</h4>
                    <input
                        className={[st["input"], st["epochs-input"]].join(" ")}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setEpochsValue("");
                                return;
                            }
                            let val = parseInt?.(e.target.value);

                            if (val > 999) return;

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
                    <div
                        data-info-text={infoText.epochs}
                        className={st["more-info"]}
                    >
                        <FontAwesomeIcon
                            className={st["cosmetic"]}
                            icon={faQuestion}
                        />
                        {/* <FontAwesomeIcon icon={faSealQuestion} /> */}
                    </div>
                </label>

                <label className={st["label"]} htmlFor="learning-rate">
                    <h4 className={st["header"]}>Скорость обучения?</h4>
                    <input
                        disabled={isAdam}
                        className={[
                            st["input"],
                            isAdam ? st["stroked"] : "",
                        ].join(" ")}
                        value={learningRate}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setLearningRate("");
                                return;
                            }

                            setLearningRate(`${e.target.value}`);
                            store.setTrainingOptions({
                                learningRate:
                                    parseFloat(e.target.value) ||
                                    store.defaultTrainingOptions.learningRate,
                            });
                        }}
                        type="number"
                        id="learning-rate"
                    />
                    {isAdam && (
                        <div className={[st["adam-warn"]].join(" ")}>
                            <FontAwesomeIcon icon={faExclamationCircle} /> Adam
                            автоматически выбирает скорость обучения
                        </div>
                    )}

                    <div
                        data-info-text={infoText.learningRate}
                        className={st["more-info"]}
                    >
                        <FontAwesomeIcon
                            className={st["cosmetic"]}
                            icon={faQuestion}
                        />
                    </div>
                </label>
                <button
                    className={st["default-btn"]}
                    onClick={() => {
                        store.setTrainingOptions({
                            ...store.defaultTrainingOptions,
                        });

                        setEpochsValue(
                            `${store.defaultTrainingOptions.epochs}`
                        );
                        setLearningRate(
                            `${store.defaultTrainingOptions.learningRate}`
                        );
                    }}
                >
                    Сбросить настройки <FontAwesomeIcon icon={faHistory} />
                </button>
            </form>
        </div>
    );
}

export default observer(TrainingOptions);
