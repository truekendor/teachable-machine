// * external modules
import { observer } from "mobx-react-lite";

// * hooks
import { useRef, useEffect } from "react";

// * contexts/stores
import neuralStore from "../../store/neuralStore";

// * components
import PredictionBoard from "../PredictionBoard/PredictionBoard";

// * styles/icons
import st from "./Rightbar.module.css";

type Props = {
    setCamera: (ref: HTMLVideoElement) => void;
};

function Rightbar({ setCamera }: Props) {
    const predictionCamRef = useRef<HTMLVideoElement>();

    useEffect(() => {
        setCamera(predictionCamRef.current);
    });

    return (
        // <Column span={7} min={18} width={24} max={30}>
        <div className={[st["main"]].join(" ")}>
            <h3>Просмотр</h3>
            {neuralStore.isModelTrained && (
                <video
                    className={[
                        st["video"],
                        !neuralStore.isModelTrained && "visually-hidden",
                    ].join(" ")}
                    ref={predictionCamRef}
                    autoPlay={true}
                ></video>
            )}

            <div className={[st["info"]].join(" ")}>
                {neuralStore.isModelTrained && <PredictionBoard />}

                <p
                    className={[
                        st["p-warn"],
                        neuralStore.isModelTrained && "visually-hidden",
                    ].join(" ")}
                >
                    Перед началом предварительного просмотра обучите модель
                </p>
            </div>
        </div>
        // </Column>
    );
}

export default observer(Rightbar);
