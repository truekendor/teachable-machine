import { useContext, useState } from "react";
import { Context } from "../../index";

import st from "./TrainingOptions.module.css";
import { observer } from "mobx-react-lite";

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
                <label className={[st["label"]].join(" ")} htmlFor="">
                    <h4>Optimiser</h4>
                    <select name="" id="">
                        <option value="">Adam</option>
                        <option value="">Sgd</option>
                    </select>
                </label>
                <label className={[st["label"]].join(" ")} htmlFor="">
                    <h4>Валидация</h4>
                    <select name="" id="">
                        <option value="">0</option>
                        <option value="">0.05</option>
                        <option value="">0.10</option>
                        <option value="">0.15</option>
                    </select>
                </label>

                <label className={[st["label"]].join(" ")} htmlFor="batch-size">
                    <h4>Размер пачки</h4>
                    <select
                        onChange={(e) => {
                            console.log(e.target.value);
                        }}
                        id="batch-size"
                    >
                        <option disabled={length < 16}>16</option>
                        <option disabled={length < 32}>32</option>
                        <option disabled={length < 64}>64</option>
                        <option disabled={length < 128}>128</option>
                        <option disabled={length < 256}>256</option>
                        <option disabled={length < 512}>512</option>
                    </select>
                </label>
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
