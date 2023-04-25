import { useRef, useContext, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./VideoContainer.module.css";

interface Props {
    queue: number;
}

function VideoContainer({ queue }: Props) {
    const { store } = useContext(Context);
    const isCurrent = store.currentCard === queue;

    const stream = useRef<MediaStream>();
    const camRef = useRef<HTMLVideoElement>();

    function userHasCamera() {
        return !!navigator?.mediaDevices?.getUserMedia;
    }

    async function enableCamera() {
        if (!userHasCamera()) {
            console.warn("Камера не поддерживается вашим браузером");
            return;
        }

        const constraints = {
            video: true,
            width: 640,
            height: 480,
        };
        const result = await navigator.mediaDevices.getUserMedia(constraints);
        stream.current = result;
        camRef.current.srcObject = result;

        camRef.current.addEventListener("loadeddata", () => {
            // prediction loop on data load
            console.log("TRUE");
        });
    }

    const iffe = (async function () {
        // console.log("IFFE");
        if (!isCurrent) {
            // console.log("DISABLE");
            disableCamera();
            return;
        }
        // console.log("ENABLE");

        await enableCamera();
    })();

    // TODO переделать на setInterval для большей кастомизации
    // TODO времени между кадрами
    function dataGatherLoop() {
        if (!store.isGatheringData) {
            return;
        }
        console.log("LOOP");

        let imageFeatures: tf.Tensor1D = store.calculateFeaturesOnCurrentFrame(
            camRef.current
        );

        store.pushToTrainingData(imageFeatures, queue);
        // imageFeatures.dispose();

        window.requestAnimationFrame(dataGatherLoop);
    }

    function disableCamera() {
        stream?.current?.getTracks?.().forEach((track) => track.stop());
    }

    return (
        <div className={[st["video-container"]].join(" ")}>
            {isCurrent && (
                <button
                    onClick={() => {
                        disableCamera();
                        store.setCurrentCard(-1);
                    }}
                >
                    закончить съемку
                </button>
            )}
            <div className={`${st["test"]}`}>
                <video
                    autoPlay={isCurrent}
                    className={[
                        st["video"],
                        !isCurrent && st["visually-hidden"],
                    ].join(" ")}
                    ref={camRef}
                ></video>
            </div>
            {isCurrent && (
                <button
                    className={`${st["record-btn"]}`}
                    onMouseDown={() => {
                        store.setIsGatheringData(true);

                        dataGatherLoop();
                    }}
                    onMouseUp={() => {
                        store.setIsGatheringData(false);
                    }}
                    onMouseLeave={() => {
                        store.setIsGatheringData(false);
                    }}
                >
                    Удерживайте для записи
                </button>
            )}
        </div>
    );
}

export default observer(VideoContainer);
