import { useContext } from "react";
import PredictionBar from "../PredictionBar/PredictionBar";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./PredictionBoard.module.css";

import { v4 } from "uuid";

type Props = {};

function PredictionBoard({}: Props) {
    const { store } = useContext(Context);

    return (
        <div className={`${st["prediction-board"]}`}>
            {store.predictionList.map((el, index) => {
                return (
                    <PredictionBar
                        key={v4()}
                        name={store.labelsArray[index]}
                        value={store.predictionList[index]}
                    />
                );
            })}
        </div>
    );
}

export default observer(PredictionBoard);
