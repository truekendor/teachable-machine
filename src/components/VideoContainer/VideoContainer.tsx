import { useRef, useContext, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./VideoContainer.module.css";
import DataCollectorBtn from "../UI/DataCollectorBtn/DataCollectorBtn";
import Webcam from "../Webcam/Webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import cardStore from "../../store/CardStore";

interface Props {
    queue: number;
}

const constraints = {
    video: true,
    width: 640,
    height: 480,
};

function VideoContainer({ queue }: Props) {
    const { store } = useContext(Context);

    const isCurrent = store.currentCard === queue;

    const stream = useRef<MediaStream>();
    const camRef = useRef<HTMLVideoElement>();

    const testRef = useRef<HTMLCanvasElement>();

    function disableViaMicrotask() {
        queueMicrotask(disableCamera);
        store.setCurrentCard(-1);
    }

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

    function createImageFromVideo() {
        const c = testRef.current.getContext("2d");

        testRef.current.width = 100;
        testRef.current.height = (constraints.height / constraints.width) * 100;

        c.translate(testRef.current.width, 0);
        c.scale(-1, 1);

        c.drawImage(
            camRef.current,
            0,
            0,
            testRef.current.width,
            testRef.current.height
        );

        const dataUrl = testRef.current.toDataURL();

        return dataUrl;
    }

    async function enableCamera() {
        if (!userHasCamera()) {
            console.warn("Камера не поддерживается вашим браузером");
            return;
        }

        const result = await navigator.mediaDevices.getUserMedia(constraints);
        stream.current = result;
        camRef.current.srcObject = result;

        camRef.current.addEventListener("loadeddata", () => {
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
            return;
        }

        let imageFeatures: tf.Tensor1D = store.calculateFeaturesOnCurrentFrame(
            camRef.current
        );

        const data = createImageFromVideo();
        if (data) {
            store.pushToBase64(data, queue);
        } else {
            console.log("no image data");
        }

        store.pushToTrainingData(imageFeatures, queue);

        window.requestAnimationFrame(dataGatherLoop);
    }

    return (
        <div
            className={[st["video-container"], isCurrent && st["current"]].join(
                " "
            )}
        >
            {isCurrent && (
                <div className={[st["top-panel"]].join(" ")}>
                    <button
                        onClick={() => {
                            store.toggleMirrorWebcam();
                        }}
                    >
                        <FontAwesomeIcon icon={faLeftRight} />
                    </button>
                    <button onClick={disableViaMicrotask}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            )}
            <Webcam isCurrent={isCurrent} ref={camRef} />
            {isCurrent && <DataCollectorBtn onMouseDown={dataGatherLoop} />}
            <canvas
                className={[st["canvas"], st["visually-hidden"]].join(" ")}
                ref={testRef}
            ></canvas>
        </div>
    );
}

export default observer(VideoContainer);
