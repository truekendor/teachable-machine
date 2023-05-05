import { useContext, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

import "./index.css";
import TrainingArea from "./components/TrainingArea/TrainingArea";
import CanvasForCurves from "./components/CanvasForCurves/CanvasForCurves";
import Rightbar from "./components/Rightbar/Rightbar";
import CardContainer from "./components/CardsContainer/CardContainer";
import Column from "./components/Column/Column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

function App() {
    const { store } = useContext(Context);

    const appRef = useRef<HTMLDivElement>();
    const predictionCamRef = useRef<HTMLVideoElement>();
    const animationFrame = useRef<number>();

    const [warn, setWarn] = useState(false);
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
    }, [
        store.labelsArray.length,
        store.currentCard,
        store.isModelTrained,
        store.optionsBtnClicked,
        store,
    ]);

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
            tf.tidy(function () {
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
        setTimeout(() => {
            setWarn(true);
        });

        setTimeout(() => {
            setWarn(false);
        }, 1500);

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

            {warn && (
                <div className={"warn no-data"}>
                    <>
                        <FontAwesomeIcon icon={faExclamationCircle} /> Данные
                        собраны не для всех классов{" "}
                        <p className="warn-accent">
                            {store.labelsArray[store.noDataIndex]}
                        </p>
                    </>
                </div>
            )}

            {store.isTraining && (
                <div
                    style={
                        {
                            "--epoch-completed": `${
                                (store.currentEpoch /
                                    store.trainingOptions.epochs) *
                                100
                            }%`,
                        } as React.CSSProperties
                    }
                    className="warn"
                >
                    <div>Не переключайте вкладки пока модель обучается</div>
                    <div>
                        {store.currentEpoch} / {store.trainingOptions.epochs}
                    </div>
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
