import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import st from "./TrainingArea.module.css";

type Props = {
    onClick: () => void;
};

function TrainingArea({ onClick }: Props) {
    const { store } = useContext(Context);

    return (
        <div className={[st["container"]].join(" ")}>
            <div className={[st["main-area"]].join(" ")}>
                <h3>Обучение</h3>
                {!store.isModelTrained && (
                    <button
                        className={[st["train-btn"]].join(" ")}
                        onClick={onClick}
                    >
                        Обучить модель
                    </button>
                )}
            </div>
        </div>
    );
}

export default observer(TrainingArea);
