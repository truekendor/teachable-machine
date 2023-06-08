import * as tf from "@tensorflow/tfjs";
import store from "../store/Store";
import neuralStore, { TrainingOptions } from "../store/neuralStore";

interface TrainObject {
    trainingDataInputs: tf.Tensor1D[];
    trainingDataOutputs: number[];
    trainingOptions: TrainingOptions;
    model: tf.Sequential;
}
export class NeuralHelper {
    private URL = `https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1`;
    private MOBILE_NET_INPUT_HEIGHT = 224;
    private MOBILE_NET_INPUT_WIDTH = 224;

    initialModelSetup() {
        const model = tf.sequential();

        model.add(
            tf.layers.dense({
                inputShape: [1024],
                units: 128,
                activation: "relu",
            })
        );

        // output layer
        model.add(
            tf.layers.dense({
                units: 3,
                activation: "softmax",
            })
        );

        model.compile({
            optimizer: "adam",
            loss: "categoricalCrossentropy",
            metrics: ["accuracy"],
        });

        return model;
    }

    setupModel(numberOfCategories: number, trainingOptions: TrainingOptions) {
        const model = tf.sequential();

        model.add(
            tf.layers.dense({
                inputShape: [1024],
                units: 128,
                activation: "relu",
            })
        );

        // output layer
        model.add(
            tf.layers.dense({
                units: numberOfCategories,
                activation: "softmax",
            })
        );

        model.compile({
            optimizer:
                trainingOptions.optimizer === "adam"
                    ? "adam"
                    : tf.train.sgd(trainingOptions.learningRate),

            loss:
                numberOfCategories === 2
                    ? "binaryCrossentropy"
                    : "categoricalCrossentropy",
            metrics: ["accuracy"],
        });

        return model;
    }

    async loadMobilenetModel() {
        const mobilenet = await tf.loadGraphModel(this.URL, {
            fromTFHub: true,
        });

        tf.tidy(() => {
            mobilenet.predict(
                // * [1, y, x, 3]
                tf.zeros([
                    1,
                    this.MOBILE_NET_INPUT_HEIGHT,
                    this.MOBILE_NET_INPUT_WIDTH,
                    3,
                ])
            );
        });

        return mobilenet;
    }

    async train({
        trainingDataInputs,
        trainingDataOutputs,
        trainingOptions,
        model,
    }: TrainObject) {
        tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);

        const outputsAsTensor = tf.tensor1d(trainingDataOutputs, "int32");
        const oneHotOutputs = tf.oneHot(
            outputsAsTensor,
            // TODO should be part of trainingOptions
            store.labelsArray.length
        );
        const inputsAsTensor = tf.stack(trainingDataInputs);

        await model.fit(inputsAsTensor, oneHotOutputs, {
            shuffle: true,
            batchSize: trainingOptions.batchSize,
            epochs: trainingOptions.epochs,
            validationSplit: trainingOptions.validationSplit || 0,

            callbacks: {
                // for whatever reason, disabling the logProgress method
                // slows down epochPromise when train button pressed
                onEpochEnd: this.logProgress,
                onEpochBegin: this.epochPromise,
            },
        });

        outputsAsTensor.dispose();
        oneHotOutputs.dispose();
        inputsAsTensor.dispose();
    }

    calculateFeaturesOnCurrentFrame(
        ref: HTMLVideoElement,
        mobilenet: tf.GraphModel
    ) {
        try {
            return tf.tidy(() => {
                const videoFrameAsTensor = tf.browser.fromPixels(ref);

                // Resize image to mobilenet size
                const resizedTensorFrame = tf.image.resizeBilinear(
                    videoFrameAsTensor,
                    [this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH],
                    true
                );

                // tensors normalization [0, 1]
                const normalizedTensorFrame = resizedTensorFrame.div(255);

                return (
                    mobilenet
                        .predict(normalizedTensorFrame.expandDims())
                        // @ts-ignore
                        .squeeze()
                );
            });
        } catch (e: any) {
            console.log(e.message);
        }
    }

    private logProgress(epoch: any, logs: any) {
        console.log("Data for epoch " + epoch, logs);
    }

    private epochPromise(number: number) {
        new Promise((res) => {
            res(number);
        }).then((epoch) => {
            // @ts-ignore
            neuralStore.setCurrentEpoch(epoch);
        });
    }
}

const neuralHelper = new NeuralHelper();

export default neuralHelper;
