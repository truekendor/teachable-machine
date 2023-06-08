// * external modules
import { observer } from "mobx-react-lite";
import { tidy, memory } from "@tensorflow/tfjs";
// import * as tf from "@tensorflow/tfjs";

// * hooks
import { useContext, useRef, useState } from "react";
import useInterval from "./hooks/useInterval";

// * stores
import { Context } from "./index";
import neuralStore from "./store/neuralStore";

// * components
import TrainingArea from "./components/TrainingArea/TrainingArea";
import CanvasForCurves from "./components/CanvasForCurves/CanvasForCurves";
import Rightbar from "./components/Rightbar/Rightbar";
import CardContainer from "./components/CardsContainer/CardContainer";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import WarnComponent from "./components/WarnComponent/WarnComponent";
import { Webcam } from "./components/Webcam/Webcam";
import LoaderCanvas from "./components/UI/LoaderCanvas/LoaderCanvas";

// * styles
import "./index.css";

// * others
import { debugTfMemory } from "./utils/utils";

export const videoConstrains = {
    video: true,
    width: 640,
    height: 480,
};

function App() {
    const { store } = useContext(Context);

    const appRef = useRef<HTMLDivElement>();

    const predictionCamRef = useRef<HTMLVideoElement>();

    const predictInterval = useInterval(predictLoop, 50);

    const [warn, setWarn] = useState(false);

    const mainStyle = {
        "--inner-height": store.innerHeight,
    } as React.CSSProperties;

    // ! debug tf memory
    // debugTfMemory.debugMemory();
    // ! ====

    async function enableCamera() {
        const result = await navigator.mediaDevices.getUserMedia(
            videoConstrains
        );
        const cancelPredict = predictInterval();

        predictionCamRef.current.srcObject = result;
        predictionCamRef.current.addEventListener("loadeddata", () => {
            // Forgive me, Father for I have sinned
            cancelPredict();
            predictInterval();
        });
    }

    // TODO вынести в utils как функцию помощник
    function predictLoop() {
        if (!neuralStore.isModelTrained || store.isGatheringData) {
            // double call cancels loop
            predictInterval()();
            return;
        }

        try {
            tidy(() => {
                const imageFeatures =
                    neuralStore.calculateFeaturesOnCurrentFrame(
                        predictionCamRef.current
                    );

                if (!imageFeatures) return;

                const prediction = neuralStore.model
                    .predict(imageFeatures.expandDims())
                    // @ts-ignore
                    .squeeze();
                const predictionArray = prediction.arraySync();
                neuralStore.setPredictionList(predictionArray);
            });
        } catch (e: any) {
            console.log(e.message);
        }
    }

    async function onClickHandler() {
        if (!store.isAllDataGathered) {
            setTimeout(() => {
                setWarn(true);
            });

            setTimeout(() => {
                setWarn(false);
            }, 1500);

            return;
        }

        store.setCurrentCard(-1);

        await neuralStore.train();

        await enableCamera();
    }

    function setPredictionCamera(ref: HTMLVideoElement) {
        predictionCamRef.current = ref;
    }

    return (
        <div ref={appRef} className="App">
            <header>
                <h2 className="header">Teachable machine</h2>
            </header>

            {!neuralStore.isNetReady && (
                <div className="loader-div">
                    <LoaderCanvas />
                </div>
            )}

            {warn && <WarnComponent />}

            {neuralStore.isTraining && <ProgressBar />}

            <main style={mainStyle} className={`main`}>
                <CardContainer />

                <CanvasForCurves width={60} />

                <TrainingArea onClick={onClickHandler} />

                {/* <Column span={2} min={0.7} width={3.2} max={4.4}> */}
                <div className="line-sticky"></div>
                {/* </Column> */}

                <Rightbar setCamera={setPredictionCamera} />

                <Webcam />
            </main>
        </div>
    );
}

export default observer(App);
