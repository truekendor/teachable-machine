import { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";

import st from "./Rightbar.module.css";
import "../../index.css";
import PredictionBoard from "../PredictionBoard/PredictionBoard";
import Column from "../Column/Column";
import neuralStore from "../../store/neuralStore";

type Props = {
    setCamera: (ref: HTMLVideoElement) => void;
};

function Rightbar({ setCamera }: Props) {
    const predictionCamRef = useRef();

    useEffect(() => {
        setCamera(predictionCamRef.current);
    });

    return (
        <Column min={18} width={24} max={30}>
            <div className={[st["main"]].join(" ")}>
                <h3>Просмотр</h3>
                <video
                    className={[
                        st["video"],
                        !neuralStore.isModelTrained && "visually-hidden",
                    ].join(" ")}
                    ref={predictionCamRef}
                    autoPlay={neuralStore.isModelTrained}
                ></video>
                <div className={[st["info"]].join(" ")}>
                    {neuralStore.isModelTrained && <PredictionBoard />}
                    {!neuralStore.isModelTrained && (
                        <p>
                            Перед началом предварительного просмотра обучите
                            модель
                        </p>
                    )}
                </div>
            </div>
        </Column>
    );
}

export default observer(Rightbar);
