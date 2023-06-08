import { makeAutoObservable } from "mobx";
import * as tf from "@tensorflow/tfjs";

import neutralHelper from "../utils/neuralHelper";
import { calculateNewTrainingData } from "../utils/utils";
import neuralHelper from "../utils/neuralHelper";

const Optimizer = {
    adam: "adam",
    sgd: "sgd",
} as const;

export interface TrainingOptions {
    batchSize: number;
    epochs: number;
    optimizer: (typeof Optimizer)[keyof typeof Optimizer];
    validationSplit: number;
    learningRate: number;
}

const defaultTrainingOptions: TrainingOptions = {
    batchSize: 16,
    epochs: 20,
    optimizer: "adam",
    validationSplit: 0.15,
    learningRate: 0.0001,
} as const;

export class NeuralStore {
    private mobilenet: tf.GraphModel;
    model: tf.Sequential;
    isNetReady = false;

    private trainingDataInputs: tf.Tensor1D[] = [];
    private trainingDataOutputs: number[] = [];

    numberOfCategories = 3;

    // * Both neural net and UI
    isModelTrained = false;
    currentEpoch = -1;

    isTraining = false;

    prediction: string;
    predictionList: number[] = [];

    defaultTrainingOptions = defaultTrainingOptions;
    trainingOptions: TrainingOptions = {
        batchSize: 16,
        epochs: 20,
        optimizer: "adam",
        validationSplit: 0.15,
        learningRate: 0.0001,
    };

    constructor() {
        makeAutoObservable(this);

        this.loadMobilenetModel();
        this.initialSetup();
    }

    setupModel() {
        if (this.numberOfCategories <= 1) return;

        this.model.dispose();
        this.model = neuralHelper.setupModel(
            this.numberOfCategories,
            this.trainingOptions
        );
    }

    setTrainingOptions(options: Partial<TrainingOptions>) {
        this.trainingOptions = {
            ...this.trainingOptions,
            ...options,
        };
    }

    async train() {
        try {
            this.setIsModelTrained(false);
            this.setIsTraining(true);

            await neuralHelper.train({
                model: this.model,
                trainingDataInputs: this.trainingDataInputs,
                trainingDataOutputs: this.trainingDataOutputs,
                trainingOptions: this.trainingOptions,
            });

            this.setIsModelTrained(true);
        } catch (e: any) {
            this.setIsModelTrained(false);
            console.log(e.message);
        } finally {
            this.setIsTraining(false);
        }
    }

    setIsNetReady(state: boolean) {
        this.isNetReady = state;
    }

    pushToTrainingData(input: tf.Tensor1D, output: number) {
        this.trainingDataInputs.push(input);
        this.trainingDataOutputs.push(output);
    }

    removeLabelByIndex(index: number) {
        if (this.numberOfCategories > 0) {
            this.setupModel();

            /**
             * returns new data for inputs/outputs
             * without data for given card index
             *
             * @returns {newIn: tf.Tensor1D[], newOut: number[]}
             */
            const { newIn, newOut } = calculateNewTrainingData({
                trainingDataInputs: this.trainingDataInputs,
                trainingDataOutputs: this.trainingDataOutputs,
                index,
            });

            this.trainingDataInputs = [...newIn];
            this.trainingDataOutputs = [...newOut];
        }
    }

    calculateFeaturesOnCurrentFrame(ref: HTMLVideoElement) {
        const result = neuralHelper.calculateFeaturesOnCurrentFrame(
            ref,
            this.mobilenet
        );

        if (result) return result;
    }

    setCurrentEpoch(epoch: number) {
        this.currentEpoch = epoch;
    }

    setPredictionList(array: number[]) {
        this.predictionList = [...array];
    }

    setNumberOfCategories(amount: number) {
        this.numberOfCategories = amount;

        this.setupModel();
    }

    private async loadMobilenetModel() {
        try {
            // await new Promise(res => {
            //     setTimeout(res, 4000)
            // })

            this.mobilenet = await neuralHelper.loadMobilenetModel();

            this.setIsNetReady(true);
        } catch (e: any) {
            // console.log(e.message);
            this.setIsNetReady(false);
            console.log("Failed to fetch mobilenet");
        }
    }

    private initialSetup() {
        this.model = neutralHelper.initialModelSetup();
    }

    private setIsTraining(bool: boolean) {
        this.isTraining = bool;
    }

    private setIsModelTrained(bool: boolean) {
        this.isModelTrained = bool;
    }
}

const neuralStore = new NeuralStore();

export default neuralStore;
