import React from "react";

import st from "./TrainingOptions.module.css";

type Props = {};

export default function TrainingOptions({}: Props) {
    return (
        <div className={[st["options"]].join(" ")}>
            <form className={[st["options-form"]].join(" ")}>
                <label className={[st["label"]].join(" ")} htmlFor="batch-size">
                    <h4>Batch Size</h4>
                    <input type="number" id="batch-size" />
                </label>
                <label className={[st["label"]].join(" ")} htmlFor="epochs">
                    <h4>Количество Эпох</h4>
                    <input type="number" id="epochs" min={1} max={900} />
                </label>
                <label className={[st["label"]].join(" ")} htmlFor="shuffle">
                    <h4>Перемешивать?</h4>
                    <input defaultChecked type="checkbox" id="shuffle" />
                </label>
            </form>
        </div>
    );
}
