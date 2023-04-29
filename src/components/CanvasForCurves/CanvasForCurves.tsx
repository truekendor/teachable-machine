import { useCallback, useContext, useEffect, useRef } from "react";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import st from "./CanvasForCurves.module.css";

type Props = {
    width: number;
};

function CanvasForCurves({ width }: Props) {
    const { store } = useContext(Context);

    const canvasRef = useRef<HTMLCanvasElement>();
    const c = useRef<CanvasRenderingContext2D>();

    const drawCurves = useCallback(() => {
        function draw() {
            c.current = canvasRef.current.getContext("2d");
            const list = [...store.cardBoundingBoxes];

            const { height: canvasHeight, top } =
                canvasRef.current.getBoundingClientRect();

            canvasRef.current.width = width;
            canvasRef.current.height = canvasHeight;

            // TODO мб сделать стиль линий dashed и тогда их можно будет анимировать
            for (let i = 0; i < list.length; i++) {
                let { node } = list[i];
                c.current.strokeStyle = "rgb(165, 165, 165)";
                c.current.lineWidth = 1;

                let halfCard =
                    node.offsetTop +
                    node.clientHeight / 2 -
                    canvasRef.current.offsetTop;

                let halfCanvas = window.innerHeight / 2 - top;

                const OFFSET = canvasRef.current.width / 2 + 10;

                let cpx1 = OFFSET;
                let cpx2 = canvasRef.current.width - OFFSET;
                let cpy1 = halfCard;
                let cpy2 = halfCanvas;

                c.current.beginPath();
                c.current.moveTo(0, halfCard);
                c.current.bezierCurveTo(
                    cpx1,
                    cpy1,
                    cpx2,
                    cpy2,
                    canvasRef.current.width,
                    halfCanvas
                );

                c.current.stroke();
                c.current.closePath();
            }
        }

        queueMicrotask(draw);
    }, [width, store.cardBoundingBoxes, store.isModelTrained]);

    useEffect(() => {
        window.addEventListener("scroll", drawCurves);

        return () => {
            window.removeEventListener("scroll", drawCurves);
        };
    });

    useEffect(() => {
        drawCurves();
    }, [store.labelsArray.length, drawCurves, store.currentCard]);

    return (
        // <div className={[st["container"]].join(" ")}>
        <canvas className={[st["canvas"]].join(" ")} ref={canvasRef}></canvas>
        // </div>
    );
}

export default observer(CanvasForCurves);
