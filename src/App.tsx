// * core
import { useContext, useEffect, useRef, useState } from "react";
import { tidy, memory } from "@tensorflow/tfjs";
import { observer } from "mobx-react-lite";

import { Context } from "./index";

// * components
import TrainingArea from "./components/TrainingArea/TrainingArea";
import CanvasForCurves from "./components/CanvasForCurves/CanvasForCurves";
import Rightbar from "./components/Rightbar/Rightbar";
import CardContainer from "./components/CardsContainer/CardContainer";
import Column from "./components/Column/Column";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import WarnComponent from "./components/WarnComponent/WarnComponent";

// * styles
import "./index.css";

function App() {
    const { store } = useContext(Context);

    const appRef = useRef<HTMLDivElement>();
    const predictionCamRef = useRef<HTMLVideoElement>();
    const animationFrame = useRef<number>();

    const [warn, setWarn] = useState(false);

    const mainStyle = {
        "--inner-height": store.innerHeight,
    } as React.CSSProperties;

    // ! debug
    // setInterval(() => {
    //     console.log(tf.memory().numTensors);
    // }, 1500);

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

    function predictLoop(time = 0) {
        if (!store.isModelTrained || store.isGatheringData) return;

        try {
            tidy(function () {
                let imageFeatures = store.calculateFeaturesOnCurrentFrame(
                    predictionCamRef.current
                );

                let prediction = store.model
                    ?.predict(imageFeatures?.expandDims?.())
                    // @ts-ignore
                    ?.squeeze();
                let predictionArray = prediction.arraySync();

                store.setPredictionList(predictionArray);
            });

            animationFrame.current = window.requestAnimationFrame(predictLoop);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    async function onClickHandler() {
        if (!store.allDataGathered) {
            setTimeout(() => {
                setWarn(true);
            });

            setTimeout(() => {
                setWarn(false);
            }, 1500);
        }

        if (!store.allDataGathered) return;

        cancelAnimationFrame(animationFrame?.current);
        store.setIsModelTrained(false);

        store.setCurrentCard(-1);

        await store.train();

        // in case of an error
        if (!store.isModelTrained) return;

        await enableCamera();
    }

    function setPredictionCamera(ref: HTMLVideoElement) {
        predictionCamRef.current = ref;
    }

    // if (!store.mobilenet) {
    //     return null;
    //     // return <div>Loading mobilenet</div>;
    // }

    // TODO <TrainingArea /> && <Rightbar />сделать логику их размеров через CSS
    return (
        <div ref={appRef} className="App">
            <header>
                <h2 className="header">Teachable machine</h2>
            </header>

            {warn && <WarnComponent />}

            {store.isTraining && (
                <ProgressBar
                    currentEpoch={store.currentEpoch}
                    numOfEpochs={store.trainingOptions.epochs}
                />
            )}

            <main style={mainStyle} className={`main`}>
                <CardContainer />

                <CanvasForCurves width={60} />

                <TrainingArea onClick={onClickHandler} />

                <Column min={0.7} width={3.2} max={4.4}>
                    <div className="line-sticky"></div>
                </Column>

                <Rightbar setCamera={setPredictionCamera} />
            </main>
        </div>
    );
}

export default observer(App);
