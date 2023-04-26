import { useContext, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Card from "./components/Card/Card";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

import "./index.css";
import NewCardBtn from "./components/UI/NewCardBtn/NewCardBtn";
import PredictionBoard from "./components/PredictionBoard/PredictionBoard";
import TrainingArea from "./components/TrainingArea/TrainingArea";
import CanvasForCurves from "./components/CanvasForCurves/CanvasForCurves";
import Rightbar from "./components/Rightbar/Rightbar";
import CardContainer from "./components/Cards/CardContainer";

function App() {
    const { store } = useContext(Context);
    const predictionCamRef = useRef<HTMLVideoElement>();

    // ! debug
    // setInterval(() => {
    //     console.log(tf.memory().numTensors);
    // }, 1500);

    async function enableCamera() {
        console.log("enable prediction camera");
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

        tf.tidy(function () {
            let imageFeatures = store.calculateFeaturesOnCurrentFrame(
                predictionCamRef.current
            );
            let prediction = store.model
                .predict(imageFeatures.expandDims())
                // @ts-ignore
                .squeeze();
            let highestIndex = prediction.argMax().arraySync();
            let predictionArray = prediction.arraySync();

            store.setPrediction(
                `${store.labelsArray[highestIndex]}, уверенность ${
                    predictionArray[highestIndex] * 100
                }`
            );

            store.setPredictionList(predictionArray);
        });

        window.requestAnimationFrame(predictLoop);
    }

    async function onClickHandler() {
        store.setCurrentCard(-1);

        await store.train();

        // in case of an error
        if (!store.isModelTrained) return;

        await enableCamera();

        console.log("READY");
    }

    function setPredictionCamera(ref: HTMLVideoElement) {
        predictionCamRef.current = ref;
    }

    if (!store.mobilenet) {
        return (
            <>
                <div>Fallback</div>
                <h1>Загрузка модели</h1>
            </>
        );
    }

    return (
        <div className="App">
            <header>
                <h2>TEACHABLE MACHINE CLONE WITH REACT TYPESCRIPT</h2>
            </header>

            {store.isTraining && (
                <div className="warn">
                    Не переключайте вкладки пока сеть обучается
                </div>
            )}

            <main className={`main`}>
                <CardContainer />

                <CanvasForCurves
                    width={60}
                    list={[...store.cardBoundingBoxes]}
                />

                <TrainingArea onClick={onClickHandler} />
                <Rightbar setCamera={setPredictionCamera} />
            </main>

            {/* <PredictionBoard /> */}
        </div>
    );
}

export default observer(App);
