import * as tf from "@tensorflow/tfjs";
import store from "../store/Store";

export class NeuralHelper {
    URL = `https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1`;

    MOBILE_NET_INPUT_HEIGHT = 224;
    MOBILE_NET_INPUT_WIDTH = 224;

    initialModelSetup() {
        let model = tf.sequential();

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

    setupModel() {
        store.model.dispose();

        let model = tf.sequential();

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
                units: store.labelsArray.length,
                activation: "softmax",
            })
        );

        model.compile({
            optimizer:
                store.trainingOptions.optimizer === "adam"
                    ? "adam"
                    : tf.train.sgd(store.trainingOptions.learningRate),

            loss:
                store.labelsArray.length === 2
                    ? "binaryCrossentropy"
                    : "categoricalCrossentropy",
            metrics: ["accuracy"],
        });

        return model;
    }

    async loadMobilenetModel() {
        let result = await tf.loadGraphModel(this.URL, { fromTFHub: true });

        // ? без этого не работает нажатие на кнопку записи первые пару секунд
        tf.tidy(() => {
            result.predict(
                // !         batch_size=1, y, x, 3
                tf.zeros([
                    1,
                    this.MOBILE_NET_INPUT_HEIGHT,
                    this.MOBILE_NET_INPUT_WIDTH,
                    3,
                ])
            );
        });

        return result;
    }

    async train() {
        try {
            store.setIsTraining(true);

            tf.util.shuffleCombo(
                store.trainingDataInputs,
                store.trainingDataOutputs
            );

            let outputsAsTensor = tf.tensor1d(
                store.trainingDataOutputs,
                "int32"
            );
            let oneHotOutputs = tf.oneHot(
                outputsAsTensor,
                store.labelsArray.length
            );
            let inputsAsTensor = tf.stack(store.trainingDataInputs);

            await store.model.fit(inputsAsTensor, oneHotOutputs, {
                shuffle: true,
                batchSize: store.trainingOptions.batchSize,
                epochs: store.trainingOptions.epochs,
                validationSplit: store.trainingOptions.validationSplit || 0,

                callbacks: {
                    onEpochEnd: this.logProgress.bind(this),
                    onEpochBegin: this.epochPromise.bind(this),
                },
            });

            outputsAsTensor.dispose();
            oneHotOutputs.dispose();
            inputsAsTensor.dispose();

            store.setIsModelTrained(true);
        } catch (e: any) {
            store.setIsModelTrained(false);
            console.log(e.message);
        } finally {
            store.setIsTraining(false);
        }
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
                    store.mobilenet
                        .predict(normalizedTensorFrame.expandDims())
                        // @ts-ignore
                        .squeeze()
                );
            } catch (e: any) {
                console.log(e.message);
            }
        });
    }

    logProgress(epoch: any, logs: any) {
        console.log("Data for epoch " + epoch, logs);
    }

    epochPromise(number: number) {
        new Promise((res) => {
            res(number);
        }).then((epoch) => {
            // @ts-ignore
            store.setCurrentEpoch(epoch);
        });
    }
}
const neutralHelper = new NeuralHelper();

export default neutralHelper;
