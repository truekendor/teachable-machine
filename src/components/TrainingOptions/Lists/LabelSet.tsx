import React, { useState, useContext } from "react";

import { Context } from "../../../index";
import { infoText } from "../../../utils/infoText";
import { observer } from "mobx-react-lite";

import ResetTrainingOptBtn from "../../UI/ResetTrainingOptBtn/ResetTrainingOptBtn";
import TrainingLabel from "../../UI/TrainingLabel/TrainingLabel";
import neuralStore from "../../../store/neuralStore";

function LabelSet() {
    const { store } = useContext(Context);

    const [epochsValue, setEpochsValue] = useState("20");
    const [learningRate, setLearningRate] = useState(
        `${neuralStore.trainingOptions.learningRate}`
    );

    const isAdam = neuralStore.trainingOptions.optimizer === "adam";

    function epochHandler(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value === "") {
            setEpochsValue("");
            return;
        }
        let val = parseInt?.(e.target.value);

        if (val > 999) return;

        setEpochsValue(`${val}`);
        neuralStore.setTrainingOptions({
            epochs: val,
        });
    }

    function learningRateHandler(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value === "") {
            setLearningRate("");
            return;
        }

        setLearningRate(`${e.target.value}`);
        neuralStore.setTrainingOptions({
            learningRate:
                parseFloat(e.target.value) ||
                neuralStore.defaultTrainingOptions.learningRate,
        });
    }

    function resetHandler() {
        neuralStore.setTrainingOptions({
            ...neuralStore.defaultTrainingOptions,
        });

        setEpochsValue(`${neuralStore.defaultTrainingOptions.epochs}`);
        setLearningRate(`${neuralStore.defaultTrainingOptions.learningRate}`);
    }

    return (
        <>
            <TrainingLabel
                value={epochsValue}
                header={`Количество эпох`}
                infoText={infoText.epochs}
                onChange={epochHandler}
                stroked={false}
                min={1}
            />
            <TrainingLabel
                value={learningRate}
                header={`Скорость обучения`}
                infoText={infoText.learningRate}
                onChange={learningRateHandler}
                stroked={isAdam}
                min={1}
            />

            <ResetTrainingOptBtn onClick={resetHandler} />
        </>
    );
}

export default observer(LabelSet);
