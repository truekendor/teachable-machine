import { useContext, useEffect, useRef } from "react";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import { BoundingBoxPart } from "../../types/types";

import st from "./CanvasForCurves.module.css";

type Props = {
    width: number;
};

function CanvasForCurves({ width }: Props) {
    const { store } = useContext(Context);

    const canvasRef = useRef<HTMLCanvasElement>();
    const c = useRef<CanvasRenderingContext2D>();

    useEffect(() => {
        c.current = canvasRef.current.getContext("2d");
        const list = [...store.cardBoundingBoxes];

        function drawCurves() {
            const { height: canvasHeight, top } =
                canvasRef.current.getBoundingClientRect();

            canvasRef.current.width = width;
            canvasRef.current.height = canvasHeight;

            for (let i = 0; i < list.length; i++) {
                let card = list[i];
                c.current.strokeStyle = "gray";

                let halfCard =
                    card.node.offsetTop +
                    card.height / 2 -
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

        drawCurves();

        window.addEventListener("scroll", drawCurves);
        // window.addEventListener("resize", drawCurves);

        return () => {
            window.removeEventListener("scroll", drawCurves);
            // window.removeEventListener("resize", drawCurves);
        };
    }, [store.labelsArray.length]);

    return (
        // <div className={[st["container"]].join(" ")}>
        <canvas className={[st["canvas"]].join(" ")} ref={canvasRef}></canvas>
        // </div>
    );
}

export default observer(CanvasForCurves);
