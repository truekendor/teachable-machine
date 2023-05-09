import { makeAutoObservable } from "mobx";
import * as tf from "@tensorflow/tfjs";
import store from "./Store";

export class Canvas {
    canvas: HTMLCanvasElement;
    c: CanvasRenderingContext2D;
    width: number;

    constructor() {
        makeAutoObservable(this);
    }

    setCanvas(ref: HTMLCanvasElement) {
        this.canvas = ref;
        this.c = ref.getContext("2d");
    }

    setWidth(width: number) {
        this.canvas.width = width;
    }

    draw() {
        const list = [...store.cardBoundingBoxes];

        const { height: canvasHeight, top } =
            this.canvas.getBoundingClientRect();

        this.canvas.height = canvasHeight;

        // TODO мб сделать стиль линий dashed и тогда их можно будет анимировать
        for (let i = 0; i < list.length; i++) {
            let { node } = list[i];
            this.c.strokeStyle = "rgb(165, 165, 165)";
            this.c.lineWidth = 1;

            let halfCard =
                node.offsetTop + node.clientHeight / 2 - this.canvas.offsetTop;

            let halfCanvas = window.innerHeight / 2 - top;

            const OFFSET = this.canvas.width / 2 + 10;

            let cpx1 = OFFSET;
            let cpx2 = this.canvas.width - OFFSET;
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
