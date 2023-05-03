import { useContext, useState } from "react";
import { Context } from "../../index";

import st from "./TrainingOptions.module.css";
import { observer } from "mobx-react-lite";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";

function TrainingOptions() {
    const { store } = useContext(Context);

    const [epochsValue, setEpochsValue] = useState(20);

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
                    onChoose={(value) => console.log("value", value)}
                    title="Оптимизатор"
                />
                <DropDownMenu
                    list={["0%", "5%", "10%", "15%"]}
                    onChoose={(value) => console.log("value", value)}
                    title="Валидация"
                />

                <DropDownMenu
                    list={["16", "32", "64", "128", "256", "512"]}
                    onChoose={(value) => console.log("value", value)}
                    title="Размер пакета"
                />

                <label className={st["label"]} htmlFor="epochs">
                    <h4>Количество Эпох</h4>
                    <input
                        className={st["epochs-input"]}
                        onChange={(e) => {
                            let val = parseInt(e.target.value);

                            if (val === 0) return;

                            if (val > 999) {
                                // warn logic

                                return;
                            }

                            setEpochsValue(val);
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
                        defaultValue={0.001}
                        type="text"
                        id="learning-rate"
                    />
                </label>
                <button className={st["default-btn"]}>
                    Сбросить настройки <FontAwesomeIcon icon={faHistory} />
                </button>
            </form>
        </div>
    );
}

export default observer(TrainingOptions);
