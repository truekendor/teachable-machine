import { makeAutoObservable } from "mobx";

import { BoundingBoxPart } from "../types/types";
import { removeItemAtIndex } from "../utils/utils";
import canvas from "./Canvas";

export class Store {
    labelsArray = ["Class 1", "Class 2", "Class 3"];

    cardBoundingBoxes: BoundingBoxPart[] = [];

    isGatheringData = false;
    currentCard = -1;

    innerHeight = `${100}vh`;
    isAllDataGathered = false;

    // * contains base64 string representation of input images
    base64Array: string[][] = [];

    indexOfClassWithNoData = 0;

    buttonRef: HTMLButtonElement;

    constructor() {
        makeAutoObservable(this);

        this.setupBase64();
    }

    removeLabelByIndex(index: number) {
        this.labelsArray = removeItemAtIndex(this.labelsArray, index);
        this.cardBoundingBoxes = removeItemAtIndex(
            this.cardBoundingBoxes,
            index
        );

        this.base64Array = removeItemAtIndex(this.base64Array, index);
        this.applyUI();
        this.checkIsAllDataGathered();
    }

    setIsGatheringData(bool: boolean) {
        // record data on mouseBtnHold
        this.isGatheringData = bool;
    }

    setCurrentCard(index: number) {
        this.currentCard = index;

        this.applyUI();
    }

    setInnerHeight(value: number) {
        this.innerHeight = `${value}vh`;
    }

    removeImageByIndex(cardIndex: number, nonReversedIndex: number) {
        const resultArray = removeItemAtIndex(
            store.base64Array[cardIndex],
            nonReversedIndex
        );

        this.setBase64ForLabel(cardIndex, resultArray);
        this.checkIsAllDataGathered();
    }

    setBase64ForLabel(index: number, array: string[]) {
        this.base64Array[index] = array;
        this.checkIsAllDataGathered();
    }

    pushToBase64(string: string, index: number) {
        this.base64Array[index].push(string);
        this.checkIsAllDataGathered();
    }

    pushToLabels(label: string) {
        this.labelsArray.push(label);
        this.base64Array.push([]);

        this.applyUI();
        this.checkIsAllDataGathered();
    }

    changeLabelAtIndex(label: string, index: number) {
        this.labelsArray[index] = label;
    }

    setCardBoundingBoxByIndex(index: number, bBox: BoundingBoxPart) {
        this.cardBoundingBoxes[index] = bBox;

        this.applyUI();
    }

    setButton(ref: HTMLButtonElement) {
        this.buttonRef = ref;
    }

    private drawOnCanvas() {
        if (!canvas.canvas) return;
        canvas.draw();
    }

    private adjustParentHeight() {
        let size =
            ((this?.buttonRef?.offsetTop || window.innerHeight) /
                window.innerHeight) *
                100 -
            10;

        this.setInnerHeight(Math.round(size));
    }

    private applyUI() {
        this.adjustParentHeight();
        this.drawOnCanvas();
    }

    private setupBase64() {
        for (let i = 0; i < this.labelsArray.length; i++) {
            this.base64Array[i] = [];
        }
    }

    private checkIsAllDataGathered() {
        let isAll = true;
        for (let i = 0; i < this.base64Array.length; i++) {
            const cur = this.base64Array[i];

            if (cur.length === 0) {
                isAll = false;

                this.indexOfClassWithNoData = i;
                break;
            }
        }

        this.isAllDataGathered = isAll;
    }
}
const store = new Store();

export default store;
