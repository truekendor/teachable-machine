import { useContext, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

import "./index.css";
import TrainingArea from "./components/TrainingArea/TrainingArea";
import CanvasForCurves from "./components/CanvasForCurves/CanvasForCurves";
import Rightbar from "./components/Rightbar/Rightbar";
import CardContainer from "./components/CardsContainer/CardContainer";
import Column from "./components/Column/Column";

function App() {
    const { store } = useContext(Context);
    const appRef = useRef<HTMLDivElement>();
    const predictionCamRef = useRef<HTMLVideoElement>();

    // ! debug
    // setInterval(() => {
    //     console.log(tf.memory().numTensors);
    // }, 1500);

    useEffect(() => {
        function adjustParentHeight() {
            let size =
                ((appRef?.current?.clientHeight || window.innerHeight) /
                    window.innerHeight) *
                    100 -
                10;

            store.setInnerHeight(size);
        }

        adjustParentHeight();

        // currentCard меняется при клике на кнопку включения камеры, а она
        // меняет размеры карточки
    }, [store.labelsArray.length, store.currentCard, store.isModelTrained]);

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

        tf.tidy(function () {
            let imageFeatures = store.calculateFeaturesOnCurrentFrame(
                predictionCamRef.current
            );
            let prediction = store.model
                .predict(imageFeatures.expandDims())
                // @ts-ignore
                .squeeze();
            let predictionArray = prediction.arraySync();

            store.setPredictionList(predictionArray);
        });

        window.requestAnimationFrame(predictLoop);
    }

    async function onClickHandler() {
        if (!store.allDataGathered) return;

        store.setCurrentCard(-1);

        await store.train();

        // in case of an error
        if (!store.isModelTrained) return;

        await enableCamera();
    }

    function setPredictionCamera(ref: HTMLVideoElement) {
        predictionCamRef.current = ref;
    }

    if (!store.mobilenet) {
        return null;
        // return <div>Loading mobilenet</div>;
    }

    // TODO <TrainingArea /> && <Rightbar />сделать логику их размеров через CSS
    return (
        <div ref={appRef} className="App">
            <header>
                <h2 className="header">Teachable machine</h2>
            </header>

            {store.isTraining && (
                <div className="warn">
                    Не переключайте вкладки пока модель обучается
                </div>
            )}

            <main
                style={
                    {
                        "--inner-height": store.innerHeight,
                    } as React.CSSProperties
                }
                className={`main`}
            >
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
