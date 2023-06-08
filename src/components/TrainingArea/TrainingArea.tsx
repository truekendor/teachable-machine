// * external modules
import { observer } from "mobx-react-lite";

// * hooke
import { useState } from "react";

// * components
import TrainBtn from "./UI/TrainBtn/TrainBtn";
import OptionsBtn from "./UI/OptionsBtn/OptionsBtn";
import TrainingOptions from "../TrainingOptions/TrainingOptions";

// * styles
import st from "./TrainingArea.module.css";

type Props = {
    onClick: () => void;
};

function TrainingArea({ onClick }: Props) {
    const [expandOpt, setExpandOpt] = useState(false);

    return (
        // <Column span={6} min={9} width={13.5} max={15}>
        <div className={[st["main-area"]].join(" ")}>
            <h3>Обучение</h3>
            <TrainBtn
                onClick={() => {
                    return onClick();
                }}
            />

            <OptionsBtn
                expandOpt={expandOpt}
                onClick={() => {
                    setExpandOpt((prev) => !prev);
                }}
            />

            {expandOpt && <TrainingOptions />}
        </div>
        // </Column>
    );
}

export default observer(TrainingArea);
