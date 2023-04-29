import { useContext, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import st from "./Rightbar.module.css";
import "../../index.css";
import PredictionBoard from "../PredictionBoard/PredictionBoard";

type Props = {
    setCamera: (ref: HTMLVideoElement) => void;
};

function Rightbar({ setCamera }: Props) {
    const predictionCamRef = useRef();
    const { store } = useContext(Context);

    useEffect(() => {
        setCamera(predictionCamRef.current);
    });

    return (
        <div className={[st["container"]].join(" ")}>
            <div className={[st["main"]].join(" ")}>
                <h3>Посмотреть</h3>
                <video
                    className={[
                        st["video"],
                        !store.isModelTrained && "visually-hidden",
                    ].join(" ")}
                    ref={predictionCamRef}
                    autoPlay={store.isModelTrained}
                ></video>
                <div className={[st["info"]].join(" ")}>
                    {store.isModelTrained && <PredictionBoard />}
                    {!store.isModelTrained && (
                        <p>
                            Перед началом предварительного просмотра обучите
                            модель
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default observer(Rightbar);
