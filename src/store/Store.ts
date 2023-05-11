import { makeAutoObservable } from "mobx";
import * as tf from "@tensorflow/tfjs";

import { BoundingBoxPart } from "../types/types";
import {
    calculateNewTrainingData,
    removeImageByIndexAtStore,
    removeItemAtIndex,
} from "../utils/utils";
import canvas from "./Canvas";
import neutralHelper from "../utils/neuralHelper";

const Optimizer = {
    adam: "adam",
    sgd: "sgd",
} as const;

export interface TrainingProps {
    batchSize: number;
    epochs: number;
    optimizer: (typeof Optimizer)[keyof typeof Optimizer];
    validationSplit: number;
    learningRate: number;
}

const defaultTrainingOptions: TrainingProps = {
    batchSize: 16,
    epochs: 20,
    optimizer: "adam",
    validationSplit: 0.15,
    learningRate: 0.0001,
} as const;

export class Store {
    // * Neural net states
    // *
    model: tf.Sequential;
    mobilenet: tf.GraphModel;

    MOBILE_NET_INPUT_HEIGHT = 224;
    MOBILE_NET_INPUT_WIDTH = 224;

    trainingDataInputs: tf.Tensor1D[] = [];
    trainingDataOutputs: number[] = [];

    isGatheringData = false;

    allDataGathered = false;
    isModelTrained = false;
    isTraining = false;

    labelsArray = ["Class 1", "Class 2", "Class 3"];

    prediction: string;
    predictionList: number[] = [];
    // *
    // * ====================

    currentCard = -1;
    cardBoundingBoxes: BoundingBoxPart[] = [];

    optionsBtnClicked = false;

    innerHeight = `${100}vh`;

    // * Camera States
    mirrorWebcam = false;
    isCameraReady = false;

    // * contains base64 string representation of input images
    base64Array: string[][] = [];

    indexOfClassWithNoData = -1;
    currentEpoch = -1;

    buttonRef: HTMLButtonElement;

    defaultTrainingOptions = defaultTrainingOptions;
    trainingOptions: TrainingProps = {
        batchSize: 16,
        epochs: 20,
        optimizer: "adam",
        validationSplit: 0.15,
        learningRate: 0.0001,
    };

    constructor() {
        makeAutoObservable(this);

        this.model = neutralHelper.initialModelSetup();

        this.loadMobilenetModel();
        this.checkAllDataGathered();

        this.setupBase64();
    }

    // * ==============================
    // *  NEURAL NETWORK SECTION
    // * ==============================
    setupModel() {
        this.model = neutralHelper.setupModel();
    }

    async loadMobilenetModel() {
        let result = await neutralHelper.loadMobilenetModel();
        this.mobilenet = result;
    }

    async train() {
        await neutralHelper.train();
    }

    // * ==============================
    // * NEURAL NETWORK RELATED
    // * ==============================
    pushToTrainingData(input: tf.Tensor1D, output: number) {
        this.trainingDataInputs.push(input);
        this.trainingDataOutputs.push(output);

        // можно проверять только один раз
        // так как false его делает только удаление
        // обучающих данных, а не его добавление
        if (!this.allDataGathered) {
            this.checkAllDataGathered();
        }
    }

    calculateFeaturesOnCurrentFrame(ref: HTMLVideoElement) {
        return neutralHelper.calculateFeaturesOnCurrentFrame(ref);
    }

    removeLabelByIndex(index: number) {
        this.labelsArray = removeItemAtIndex(this.labelsArray, index);
        this.cardBoundingBoxes = removeItemAtIndex(
            this.cardBoundingBoxes,
            index
        );
        this.base64Array = removeItemAtIndex(this.base64Array, index);

        this.checkAllDataGathered();
        if (this.labelsArray.length > 0) {
            this.setupModel();

            const { newIn, newOut } = calculateNewTrainingData(index);

            this.trainingDataInputs = [...newIn];
            this.trainingDataOutputs = [...newOut];
        }
        this.applyUI();
    }

    setTrainingOptions(options: Partial<TrainingProps>) {
        this.trainingOptions = {
            ...this.trainingOptions,
            ...options,
        };

        this.setupModel();
    }

    setIsModelTrained(bool: boolean) {
        this.isModelTrained = bool;
    }

    setIsTraining(bool: boolean) {
        this.isTraining = bool;
    }

    checkAllDataGathered() {
        for (let i = 0; i < this.labelsArray.length; i++) {
            const index = this.trainingDataOutputs.indexOf(i);

            if (index === -1) {
                this.indexOfClassWithNoData = i;
                this.allDataGathered = false;

                return;
            }
        }

        this.allDataGathered = true;
        this.indexOfClassWithNoData = -1;
    }

    // ==============================
    // UI STATES
    // ==============================

    setIsGatheringData(bool: boolean) {
        // record data on mouseBtnHold
        this.isGatheringData = bool;
    }

    setIsCameraReady(state: boolean) {
        this.isCameraReady = state;
    }

    setCurrentCard(index: number) {
        this.currentCard = index;

        this.applyUI();
    }

    toggleMirrorWebcam() {
        this.mirrorWebcam = !this.mirrorWebcam;
    }

    setInnerHeight(value: number) {
        this.innerHeight = `${value}vh`;
    }

    // * =================
    // TODO вынести в утилс
    // * =================
    removeImageByIndex(cardIndex: number, imageIndex: number) {
        removeImageByIndexAtStore(cardIndex, imageIndex);
    }

    setTrainingDataInputs(array: tf.Tensor1D[]) {
        this.trainingDataInputs = array;
    }

    setTrainingDataOutputs(array: number[]) {
        this.trainingDataOutputs = array;
    }

    setBase64ForLabel(index: number, array: string[]) {
        this.base64Array[index] = array;
    }

    toggleOptionBtnClicked() {
        this.optionsBtnClicked = !this.optionsBtnClicked;
    }

    // ==============================
    // COMPONENTS STATES
    // ==============================

    pushToLabels(label: string) {
        this.labelsArray.push(label);
        this.base64Array.push([]);

        this.allDataGathered = false;

        this.applyUI();

        this.setupModel();
    }

    changeLabelAtIndex(label: string, index: number) {
        this.labelsArray[index] = label;
    }

    setPredictionList(array: number[]) {
        this.predictionList = [...array];
    }

    setCardBoundingBoxByIndex(index: number, bBox: BoundingBoxPart) {
        this.cardBoundingBoxes[index] = bBox;

        this.applyUI();
    }

    // ==============================
    // OTHERS
    // ==============================

    pushToBase64(string: string, index: number) {
        this.base64Array[index].push(string);
    }

    removeBoundingBoxByIndex(index: number) {
        this.cardBoundingBoxes = removeItemAtIndex(
            this.cardBoundingBoxes,
            index
        );
    }

    setupBase64() {
        for (let i = 0; i < this.labelsArray.length; i++) {
            this.base64Array[i] = [];
        }
    }

    setCurrentEpoch(epoch: number) {
        this.currentEpoch = epoch;
    }

    setButton(ref: HTMLButtonElement) {
        this.buttonRef = ref;
    }

    applyUI() {
        this.adjustParentHeight();
        this.drawOnCanvas();
    }

    drawOnCanvas() {
        if (canvas.canvas) {
            canvas.draw();
        }
    }

    adjustParentHeight() {
        let size =
            ((this?.buttonRef?.offsetTop || window.innerHeight) /
                window.innerHeight) *
                100 -
            10;

        this.setInnerHeight(Math.round(size));
    }
}
const store = new Store();

export default store;
