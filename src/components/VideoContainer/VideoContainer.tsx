import React, { useEffect, useRef, useState, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./VideoContainer.module.css";

interface Props {
    isVideoWindowActive: boolean;
    queue: number;
    cancelVideo: () => void;
}

function VideoContainer({ isVideoWindowActive, queue, cancelVideo }: Props) {
    const { store } = useContext(Context);
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
            store.setIsVideoPlaying(true);
        });
    }

    useEffect(() => {
        if (!isVideoWindowActive) return;
        console.log("RERENDER");

        enableCamera();

        return () => {
            disableCamera();
        };
    });

    useEffect(() => {
        if (store.currentCardWithCamera !== queue || store.isModelTrained) {
            disableCamera();
        }
    }, [store.currentCardWithCamera, store.isModelTrained]);

    function gatherDataForLabel() {
        // setIsRecording(true);

        dataGatherLoop();
    }

    function dataGatherLoop() {
        if (!store.isVideoPlaying || !store.isRecording) {
            return;
        }

        let imageFeatures: tf.Tensor1D = store.calculateFeaturesOnCurrentFrame(
            camRef.current
        );

        store.pushToTrainingData(imageFeatures, queue);
        window.requestAnimationFrame(dataGatherLoop);
    }

    function disableCamera() {
        stream?.current?.getTracks?.().forEach((track) => track.stop());
        cancelVideo();
    }

    return (
        <div className={[st["video-container"]].join(" ")}>
            {isVideoWindowActive && (
                <button
                    onClick={() => {
                        disableCamera();
                        store.setCurrentCardWithCamera(-1);
                    }}
                >
                    закончить съемку
                </button>
            )}
            <div className={`${st["test"]}`}>
                <video
                    autoPlay={isVideoWindowActive}
                    className={[
                        st["video"],
                        !isVideoWindowActive && st["visually-hidden"],
                    ].join(" ")}
                    ref={camRef}
                ></video>
            </div>
            {isVideoWindowActive && (
                <button
                    onMouseDown={() => {
                        store.setIsRecording(true);
                        gatherDataForLabel();
                    }}
                    onMouseUp={() => {
                        store.setIsRecording(false);
                    }}
                    onMouseLeave={() => {
                        store.setIsRecording(false);
                    }}
                >
                    Удерживайте для записи
                </button>
            )}
        </div>
    );
}

export default observer(VideoContainer);
