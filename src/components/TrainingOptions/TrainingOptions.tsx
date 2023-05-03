import { useContext, useState } from "react";
import { Context } from "../../index";

import st from "./TrainingOptions.module.css";
import { observer } from "mobx-react-lite";
import DropDownMenu from "../DropDownMenu/DropDownMenu";

function TrainingOptions() {
    const { store } = useContext(Context);

    const [epochsValue, setEpochsValue] = useState(20);
    const length = store.base64Array.flat().length;

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
                    list={["0.00", "0.05", "0.10", "0.15"]}
                    onChoose={(value) => console.log("value", value)}
                    title="Валидация"
                />

                <DropDownMenu
                    list={["16", "32", "64", "128", "256", "512"]}
                    onChoose={(value) => console.log("value", value)}
                    title="Размер пакета"
                />

                <label className={[st["label"]].join(" ")} htmlFor="epochs">
                    <h4>Количество Эпох</h4>
                    <input
                        onChange={(e) => {
                            setEpochsValue(+e.target.value);
                        }}
                        value={epochsValue}
                        type="number"
                        id="epochs"
                    />
                </label>

                <label
                    className={[st["label"]].join(" ")}
                    htmlFor="learning-rate"
                >
                    <h4>Скорость обучения?</h4>
                    <input
                        step={0.001}
                        defaultValue={0.001}
                        type="number"
                        id="learning-rate"
                    />
                </label>
                <button>Стандартные настройки</button>
            </form>
        </div>
    );
}

export default observer(TrainingOptions);
