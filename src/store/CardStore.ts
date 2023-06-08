import { makeAutoObservable } from "mobx";

export class CardStore {
    wasDoubleClick = false;

    private nextClassNumber = 4;

    constructor() {
        makeAutoObservable(this);
    }

    setWasDoubleClick(bool: boolean) {
        this.wasDoubleClick = bool;
    }

    getNextClassNumber() {
        this.nextClassNumber += 1;

        return this.nextClassNumber - 1;
    }
}
const cardStore = new CardStore();

export default cardStore;
