import { makeAutoObservable, remove } from "mobx";
import * as tf from "@tensorflow/tfjs";
import { BoundingBoxPart } from "../types/types";
import { removeItemAtIndex } from "../utils/utils";

interface trainingOpt {
    shuffle: boolean;
    batchSize: number;
    epochs: number;
}

export default class Store {
    URL = `https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1`;

    model: tf.Sequential;
    mobilenet: tf.GraphModel;

    MOBILE_NET_INPUT_HEIGHT = 224;
    MOBILE_NET_INPUT_WIDTH = 224;

    trainingDataInputs: tf.Tensor1D[] = [];
    trainingDataOutputs: number[] = [];

    isGatheringData = false;

    isModelTrained = false;
    isTraining = false;

    labelsArray = ["Class 1", "Class 2", "Class 3"];

    prediction: string;
    predictionList: number[] = [];

    currentCard = -1;

    cardBoundingBoxes: BoundingBoxPart[] = [];
    wasDoubleClick = false;

    switchFrom = -1;
    formSwitched = true;
    mirrorWebcam = false;
    newCardAdded = false;

    innerHeight = `${100}vh`;

    isCameraReady = false;

    base64Array: string[][] = [];

    allDataGathered = false;

    trainingOptions: trainingOpt;

    constructor() {
        makeAutoObservable(this);
        this.setupModel();
        this.loadMobilenetModel();
    }

    pushToLabels(label: string) {
        this.labelsArray.push(label);
        this.base64Array.push([]);

        this.allDataGathered = false;

        this.setupModel();
    }

    changeLabelAtIndex(label: string, index: number) {
        this.labelsArray[index] = label;

        this.labelsArray = [
            ...this.labelsArray.slice(0, index),
            label,
            ...this.labelsArray.slice(index + 1, this.labelsArray.length),
        ];
    }

    setMobilenet(mobilenet: tf.GraphModel) {
        this.mobilenet ??= mobilenet;
    }

    // record data on mouseBtnHold
    setIsGatheringData(bool: boolean) {
        this.isGatheringData = bool;
    }

    setupModel() {
        this.model = tf.sequential();

        this.model.add(
            tf.layers.dense({
                inputShape: [1024],
                units: 128,
                activation: "relu",
            })
        );

        // output layer
        this.model.add(
            tf.layers.dense({
                units: this.labelsArray.length,
                activation: "softmax",
            })
        );

        this.model.compile({
            optimizer: "adam",
            loss:
                this.labelsArray.length === 2
                    ? "binaryCrossentropy"
                    : "categoricalCrossentropy",
            metrics: ["accuracy"],
        });

        // this.model.summary();
    }

    async loadMobilenetModel() {
        let result = await tf.loadGraphModel(this.URL, { fromTFHub: true });
        this.setMobilenet(result);

        tf.tidy(() => {
            let answer = this.mobilenet.predict(
                // !         batch_size, y, x, 3
                tf.zeros([
                    1,
                    this.MOBILE_NET_INPUT_HEIGHT,
                    this.MOBILE_NET_INPUT_WIDTH,
                    3,
                ])
            );
            // @ts-ignore
            // console.log(answer.shape); // [batch_size -> 1, 1024]
        });
    }

    pushToTrainingData(input: tf.Tensor1D, output: number) {
        this.trainingDataInputs.push(input);
        this.trainingDataOutputs.push(output);

        this.checkAllDataGathered();
    }

    calculateFeaturesOnCurrentFrame(ref: HTMLVideoElement) {
        return tf.tidy(() => {
            try {
                // Считываем пиксели из видео
                let videoFrameAsTensor = tf.browser.fromPixels(ref);

                // Реcайз видео до размеров сети мобилнет
                let resizedTensorFrame = tf.image.resizeBilinear(
                    videoFrameAsTensor,
                    [this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH],
                    true
                );

                // нормализация тензора [0, 1]
                let normalizedTensorFrame = resizedTensorFrame.div(255);

                return (
                    this.mobilenet
                        .predict(normalizedTensorFrame.expandDims())
                        // @ts-ignore
                        .squeeze()
                );
            } catch (e: any) {
                console.log(e.message);
            }
        });
    }

    async train() {
        try {
            this.setIsTraining(true);

            tf.util.shuffleCombo(
                this.trainingDataInputs,
                this.trainingDataOutputs
            );

            let outputsAsTensor = tf.tensor1d(
                this.trainingDataOutputs,
                "int32"
            );
            let oneHotOutputs = tf.oneHot(
                outputsAsTensor,
                this.labelsArray.length
            );
            let inputsAsTensor = tf.stack(this.trainingDataInputs);

            await this.model.fit(inputsAsTensor, oneHotOutputs, {
                shuffle: true,
                batchSize: 5,
                epochs: 10,

                callbacks: { onEpochEnd: this.logProgress },
            });

            outputsAsTensor.dispose();
            oneHotOutputs.dispose();
            inputsAsTensor.dispose();

            this.setIsModelTrained(true);
        } catch (e: any) {
            this.setIsModelTrained(false);
            console.log(e.message);
        } finally {
            this.setIsTraining(false);
        }
    }

    logProgress(epoch: any, logs: any) {
        console.log("Data for epoch " + epoch, logs);
    }

    setIsModelTrained(bool: boolean) {
        this.isModelTrained = bool;
    }

    setPrediction(prediction: string) {
        this.prediction = prediction;
    }

    setPredictionList(array: number[]) {
        this.predictionList = [...array];
    }

    setIsTraining(bool: boolean) {
        this.isTraining = bool;
    }

    setCurrentCard(index: number) {
        this.currentCard = index;
    }

    setCardBoundingBoxByIndex(index: number, bBox: BoundingBoxPart) {
        this.cardBoundingBoxes[index] = bBox;
    }

    setWasDoubleClick(bool: boolean) {
        this.wasDoubleClick = bool;
    }

    removeLabelByIndex(index: number) {
        this.labelsArray = removeItemAtIndex(this.labelsArray, index);
        this.cardBoundingBoxes = removeItemAtIndex(
            this.cardBoundingBoxes,
            index
        );
        this.base64Array = removeItemAtIndex(this.base64Array, index);

        this.checkAllDataGathered();

        this.setupModel();

        let newIn: tf.Tensor1D[] = [];
        let newOut: number[] = [];

        for (let i = 0; i < this.trainingDataInputs.length; i++) {
            const input = this.trainingDataInputs[i];
            const output = this.trainingDataOutputs[i];

            // аутпуту присваивалось значение индекса
            if (output === index) {
                // очищаем память от ненужных тензоров
                input?.dispose?.();
            } else {
                newIn.push(input);
                // так как мы удаляем элемент, то нужно
                // подвинуть аутпуты соответственно.
                // Если аутпут больше чем индекс, то его нужно
                // сместить на единицу так как удалился один элемент
                newOut.push(index < output ? output - 1 : output);
            }
        }

        this.trainingDataInputs = [...newIn];
        this.trainingDataOutputs = [...newOut];
    }

    setSwitchFrom(index: number) {
        this.switchFrom = index;
    }

    setFormSwitched(bool: boolean) {
        this.formSwitched = bool;
    }

    setIsCameraReady(state: boolean) {
        this.isCameraReady = state;
    }

    pushToBase64(string: string, index: number) {
        if (!this.base64Array[index]) {
            for (let i = 0; i < this.labelsArray.length; i++) {
                this.base64Array[i] = [];
            }
        }

        this.base64Array[index].push(string);
    }

    removeBoundingBoxByIndex(index: number) {
        this.cardBoundingBoxes = [
            ...this.cardBoundingBoxes.slice(0, index),
            ...this.cardBoundingBoxes.slice(
                index + 1,
                this.cardBoundingBoxes.length
            ),
        ];
    }

    setTrainingOptions(options: trainingOpt) {
        this.trainingOptions = { ...options };
    }

    checkAllDataGathered() {
        for (let i = 0; i < this.labelsArray.length; i++) {
            const index = this.trainingDataOutputs.indexOf(i);

            if (index === -1) {
                this.allDataGathered = false;
                return;
            }
        }

        this.allDataGathered = true;
    }

    toggleMirrorWebcam() {
        this.mirrorWebcam = !this.mirrorWebcam;
    }

    setNewCardAdded(bool: boolean) {
        this.newCardAdded = bool;
    }

    setInnerHeight(value: number) {
        this.innerHeight = `${value}vh`;
    }

    removeImageByIndex(cardIndex: number, imageIndex: number) {
        this.base64Array[cardIndex] = removeItemAtIndex(
            this.base64Array[cardIndex],
            // массив который приходит в этот метод перевернут
            this.base64Array[cardIndex].length - 1 - imageIndex
        );

        if (this.base64Array[cardIndex].length === 0) {
            console.log("ZERO");
        }
    }
}
