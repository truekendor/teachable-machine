import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import useDebounce from "../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import st from "./TrainingArea.module.css";
import TrainBtn from "./UI/TrainBtn/TrainBtn";
import OptionsBtn from "./UI/OptionsBtn/OptionsBtn";
import Column from "../Column/Column";
import TrainingOptions from "../TrainingOptions/TrainingOptions";

type Props = {
    onClick: () => void;
};

function TrainingArea({ onClick }: Props) {
    const { store } = useContext(Context);

    const [expandOpt, setExpandOpt] = useState(false);

    return (
        <Column min={9} width={13.5} max={15}>
            <div className={[st["main-area"]].join(" ")}>
                <h3>Обучение</h3>
                {/* {!store.isModelTrained && ( */}
                <TrainBtn
                    onClick={() => {
                        store.toggleOptionBtnClicked();

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
        </Column>
    );
}

export default observer(TrainingArea);
