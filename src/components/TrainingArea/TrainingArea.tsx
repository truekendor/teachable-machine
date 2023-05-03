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

    function mouseEnterHandler() {
        setInside(true);
        debounce();
    }

    function mouseLeaveHandler() {
        setInside(false);
        debounce();
    }

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
                    onMouseEnter={mouseEnterHandler}
                    onMouseLeave={mouseLeaveHandler}
                />
                {/* )} */}
                {warn && (
                    <p className={[st["warn"]].join(" ")}>
                        <FontAwesomeIcon icon={faExclamationCircle} /> Данные
                        собраны не для всех классов
                    </p>
                )}

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
