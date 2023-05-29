import { makeAutoObservable } from "mobx";
import { BoundingBoxPart } from "../types/types";
import { removeItemAtIndex } from "../utils/utils";
import store from "./Store";
import canvas from "./Canvas";

export class CardStore {
    private switchFrom = -1;
    private formSwitched = true;
    wasDoubleClick = false;

    private currentCard = -1;
    private cardBoundingBoxes: BoundingBoxPart[] = [];

    private newCardAdded = false;

    private cardFormRefs: HTMLInputElement[] = [];

    private nextClassNumber = 4;

    constructor() {
        makeAutoObservable(this);
    }

    setSwitchFrom(index: number) {
        this.switchFrom = index;
    }

    setFormSwitched(bool: boolean) {
        this.formSwitched = bool;
    }

    setWasDoubleClick(bool: boolean) {
        this.wasDoubleClick = bool;
    }

    setNewCardAdded(bool: boolean) {
        this.newCardAdded = bool;
    }

    getNextClassNumber() {
        this.nextClassNumber += 1;

        return this.nextClassNumber - 1;
    }

    // TODO
    // setCurrentCard(index: number) {
    //     this.currentCard = index;

    //     this.applyUI();
    // }

    // setCardBoundingBoxByIndex(index: number, bBox: BoundingBoxPart) {
    //     this.cardBoundingBoxes[index] = bBox;

    //     this.applyUI();
    // }

    // ! not a single call from app???
    // removeBoundingBoxByIndex(index: number) {
    //     this.cardBoundingBoxes = removeItemAtIndex(
    //         this.cardBoundingBoxes,
    //         index
    //     );
    // }

    // applyUI() {
    //     this.adjustParentHeight();
    //     this.drawOnCanvas();
    // }

    // drawOnCanvas() {
    //     if (canvas?.canvas) {
    //         canvas?.draw?.();
    //     }
    // }

    // adjustParentHeight() {
    //     let size =
    //         ((store?.buttonRef?.offsetTop || window.innerHeight) /
    //             window.innerHeight) *
    //             100 -
    //         10;

    //     store.setInnerHeight(Math.round(size));
    // }
}
const cardStore = new CardStore();

export default cardStore;
