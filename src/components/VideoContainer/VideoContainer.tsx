import { useRef, useContext, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./VideoContainer.module.css";
import DataCollectorBtn from "../UI/DataCollectorBtn/DataCollectorBtn";
import Webcam from "../Webcam/Webcam";
import useDebounce from "../../hooks/useDebounce";

interface Props {
    queue: number;
}

function VideoContainer({ queue }: Props) {
    const { store } = useContext(Context);

    const isCurrent = store.currentCard === queue;

    const stream = useRef<MediaStream>();
    const camRef = useRef<HTMLVideoElement>();

    // Автовыключение камеры если не было собрано данных за последние N секунд
    const debouncedDisableCamera = useDebounce(() => {
        queueMicrotask(() => {
            disableCamera();
        });
        store.setCurrentCard(-1);
    }, 20 * 1000);

    useEffect(() => {
        async function handleCamera() {
            if (!isCurrent || store.currentCard === -1) {
                disableCamera();
                return;
            }

            // На всякий
            if (!store.isCameraReady) {
                await enableCamera();
            }
        }

        handleCamera();

        return () => {
            if (!isCurrent) {
                disableCamera();
            }
        };
    });

    function userHasCamera() {
        return !!navigator?.mediaDevices?.getUserMedia;
    }

    async function enableCamera() {
        if (!userHasCamera()) {
            console.warn("Камера не поддерживается вашим браузером");
            return;
        }

        debouncedDisableCamera();

        const constraints = {
            video: true,
            width: 640,
            height: 480,
        };
        const result = await navigator.mediaDevices.getUserMedia(constraints);
        stream.current = result;
        camRef.current.srcObject = result;

        camRef.current.addEventListener("loadeddata", () => {
            console.log("CAMERA READY");

            store.setIsCameraReady(true);
        });
    }

    function disableCamera() {
        store.setIsCameraReady(false);

        stream?.current?.getTracks?.().forEach((track) => track.stop());
    }

    // TODO переделать на setInterval для большей кастомизации
    // TODO времени между кадрами
    function dataGatherLoop() {
        if (!store.isGatheringData || !store.isCameraReady) {
            console.log("return from dataGather");
            return;
        }

        debouncedDisableCamera();

        console.log("LOOP");

        let imageFeatures: tf.Tensor1D = store.calculateFeaturesOnCurrentFrame(
            camRef.current
        );

        store.pushToTrainingData(imageFeatures, queue);

        window.requestAnimationFrame(dataGatherLoop);
    }

    return (
        <div className={[st["video-container"]].join(" ")}>
            {isCurrent && (
                <button
                    onClick={() => {
                        queueMicrotask(() => {
                            disableCamera();
                        });
                        store.setCurrentCard(-1);
                    }}
                >
                    закончить съемку
                </button>
            )}
            <Webcam isCurrent={isCurrent} ref={camRef} />
            {isCurrent && <DataCollectorBtn onMouseDown={dataGatherLoop} />}
        </div>
    );
}

export default observer(VideoContainer);
