import React, { useContext, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "./components/Webcam/Webcam";
import Card from "./components/Card/Card";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

import "./index.css";
import NewCardBtn from "./components/UI/NewCardBtn/NewCardBtn";

function App() {
    const { store } = useContext(Context);
    const predictionCamRef = useRef<HTMLVideoElement>();

    useEffect(() => {
        enableCamera();
    });

    async function enableCamera() {
        const constraints = {
            video: true,
            width: 640,
            height: 480,
        };
        const result = await navigator.mediaDevices.getUserMedia(constraints);

        predictionCamRef.current.srcObject = result;

        predictionCamRef.current.addEventListener("loadeddata", () => {
            predictLoop();
        });
    }

    function predictLoop() {
        if (!store.isModelTrained) return;
        try {
            tf.tidy(function () {
                let imageFeatures = store.calculateFeaturesOnCurrentFrame(
                    predictionCamRef.current
                );
                let prediction = store.model
                    // @ts-ignore
                    .predict(imageFeatures.expandDims())
                    // @ts-ignore
                    .squeeze();
                let highestIndex = prediction.argMax().arraySync();
                let predictionArray = prediction.arraySync();
                console.log(
                    store.labelsArray[highestIndex],
                    `уверенность ${predictionArray[highestIndex] * 100}%`
                );
            });
        } catch (e) {
            // @ts-ignore
            console.log(e.message);
        }

        window.requestAnimationFrame(predictLoop);
    }

    return (
        <div className="App">
            <header>
                <h2>TEACHABLE MACHINE CLONE WITH REACT TYPESCRIPT</h2>
                {store.mobilenet === undefined ? (
                    <h3>waiting model to load</h3>
                ) : (
                    <h3>model loaded</h3>
                )}
            </header>

            <main className={`main`}>
                <div
                    // TODO сделать настоящий класс для контейнера
                    className="MOCK_CLASS_NAME card-container"
                >
                    {store.labelsArray.map((el, index) => {
                        return <Card key={index} queue={index} />;
                    })}

                    <NewCardBtn
                        hidden={store.isModelTrained}
                        onClick={() =>
                            store.pushToLabels(
                                `Class ${store.labelsArray.length}`
                            )
                        }
                    />
                </div>
                <div className={`rightbar`}>
                    <button
                        onClick={async () => {
                            await store.train();

                            predictLoop();
                            console.log("READY");
                        }}
                    >
                        train
                    </button>
                    <button
                        onClick={() => {
                            predictLoop();
                        }}
                    >
                        predict
                    </button>
                </div>
                {store.isModelTrained && (
                    <video
                        ref={predictionCamRef}
                        autoPlay
                        onLoad={() => enableCamera()}
                    ></video>
                )}
            </main>
        </div>
    );
}

export default observer(App);
