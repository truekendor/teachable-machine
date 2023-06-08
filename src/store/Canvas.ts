import { makeAutoObservable } from "mobx";
import store from "./Store";

export class Canvas {
    canvas: HTMLCanvasElement;
    private c: CanvasRenderingContext2D;
    private lineColor = "rgb(165, 165, 165)";
    private lineWidth = 1;

    constructor() {
        makeAutoObservable(this);
    }

    setCanvas(ref: HTMLCanvasElement) {
        this.canvas = ref;

        this.setupCanvas();
    }

    setupCanvas() {
        this.c = this.canvas.getContext("2d", {
            willReadFrequently: true,
        });
        this.canvas.height = window.innerHeight;
    }

    draw() {
        const list = [...store.cardBoundingBoxes];
        const { top } = this.canvas.getBoundingClientRect();
        const heightInPixels =
            (parseInt(store.innerHeight) / 100) * window.innerHeight * 1.14;

        this.canvas.height = Math.max(heightInPixels, window.innerHeight);
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < list.length; i++) {
            let { node } = list[i];
            this.c.strokeStyle = this.lineColor;
            this.c.lineWidth = this.lineWidth;

            let halfCard =
                node.offsetTop + node.clientHeight / 2 - this.canvas.offsetTop;

            let halfCanvas = window.innerHeight / 2 - top;
            // let halfCanvas = this.canvas.height / 2 - top;

            const horizontalOffset = this.canvas.width / 2 + 10;

            let cpx1 = horizontalOffset;
            let cpx2 = this.canvas.width - horizontalOffset;
            let cpy1 = halfCard;
            let cpy2 = halfCanvas;

            this.c.beginPath();
            this.c.moveTo(0, halfCard);
            this.c.bezierCurveTo(
                cpx1,
                cpy1,
                cpx2,
                cpy2,
                this.canvas.width,
                halfCanvas
            );

            this.c.stroke();
            this.c.closePath();
        }
    }
}
const canvas = new Canvas();

export default canvas;
