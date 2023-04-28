import { useRef, useContext, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "../../index";
import { observer, useStaticRendering } from "mobx-react-lite";

import st from "./VideoContainer.module.css";

interface Props {
    queue: number;
}

function VideoContainer({ queue }: Props) {
    const { store } = useContext(Context);

    const isCurrent = store.currentCard === queue;

    const [ready, setReady] = useState(false);
    const readyRef = useRef(false);

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

            // TODO оно ререндерит все что движется

            setReady(true);

            // readyRef.current = true;

            // dataGatherLoop();

            console.log("READY");
        });
    }

    function disableCamera() {
        readyRef.current = false;
        stream?.current?.getTracks?.().forEach((track) => track.stop());
    }

    const iffe = (async function () {
        if (!isCurrent) {
            disableCamera();
            return;
        }

        await enableCamera();
    })();

    // TODO переделать на setInterval для большей кастомизации
    // TODO времени между кадрами
    function dataGatherLoop() {
        if (!store.isGatheringData || !ready) {
            console.log("return");
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
                    autoPlay={isCurrent && ready}
                    className={[
                        st["video"],
                        (!isCurrent || !ready) && st["visually-hidden"],
                    ].join(" ")}
                    ref={camRef}
                ></video>
            </div>
            {isCurrent && (
                <button
                    // disabled={!readyRef.current}
                    disabled={!ready}
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
