import { makeAutoObservable } from "mobx";
import * as tf from "@tensorflow/tfjs";

export default class Store {
    URL = `https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1`;

    model: tf.Sequential;
    mobilenet: tf.GraphModel;

    MOBILE_NET_INPUT_HEIGHT = 224;
    MOBILE_NET_INPUT_WIDTH = 224;

    labelsAmount = 3;

    trainingDataInputs: tf.Tensor1D[] = [];
    trainingDataOutputs: number[] = [];

    isVideoPlaying = false;
    isRecording = false;

    currentCardWithCamera: number;
    isModelTrained = false;

    labelsArray = ["Class 1", "Class 2", "Class 3"];

    constructor() {
        makeAutoObservable(this);
        this.setupModel();
        this.loadMobilenetModel();
    }

    pushToLabels(label: string) {
        this.labelsArray.push(label);
    }

    changeLabelAtIndex(label: string, index: number) {
        this.labelsArray[index] = label;
    }

    setMobilenet(mobilenet: tf.GraphModel) {
        this.mobilenet ??= mobilenet;
    }

    // is video playing (not for data recording)
    setIsVideoPlaying(bool: boolean) {
        this.isVideoPlaying = bool;
    }

    // record data on mouseBtnHold
    setIsRecording(bool: boolean) {
        this.isRecording = bool;
    }

    setCurrentCardWithCamera(index: number) {
        this.currentCardWithCamera = index;
        console.log("store", index);
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
        this.model.add(
            tf.layers.dense({
                units: this.labelsAmount,
                activation: "softmax",
            })
        );

        this.model.compile({
            optimizer: "adam",
            loss:
                this.labelsAmount === 2
                    ? "binaryCrossentropy"
                    : "categoricalCrossentropy",
            metrics: ["accuracy"],
        });

        this.model.summary();
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
            console.log(answer.shape); // [batch_size -> default == 1, 1024]
        });
    }

    pushToTrainingData(input: tf.Tensor1D, output: number) {
        this.trainingDataInputs.push(input);
        this.trainingDataOutputs.push(output);
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
        tf.util.shuffleCombo(this.trainingDataInputs, this.trainingDataOutputs);

        let outputsAsTensor = tf.tensor1d(this.trainingDataOutputs, "int32");
        let oneHotOutputs = tf.oneHot(outputsAsTensor, this.labelsAmount);
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

        this.isModelTrained = true;
    }

    logProgress(epoch: any, logs: any) {
        console.log("Data for epoch " + epoch, logs);
    }
}
