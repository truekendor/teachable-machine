import { useContext } from "react";
import PredictionBar from "../PredictionBar/PredictionBar";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./PredictionBoard.module.css";

import { v4 } from "uuid";
import neuralStore from "../../store/neuralStore";

function PredictionBoard() {
    const { store } = useContext(Context);

    return (
        <div className={`${st["prediction-board"]}`}>
            {neuralStore.predictionList.map((el, index) => {
                return (
                    <PredictionBar
                        key={v4()}
                        name={store.labelsArray[index]}
                        value={neuralStore.predictionList[index]}
                    />
                );
            })}
        </div>
    );
}

export default observer(PredictionBoard);
