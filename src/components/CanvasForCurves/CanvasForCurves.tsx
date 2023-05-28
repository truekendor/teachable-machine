import { observer } from "mobx-react-lite";

import { useEffect, useRef } from "react";

import canvas from "../../store/Canvas";

import st from "./CanvasForCurves.module.css";

type Props = {
    width: number;
};

function CanvasForCurves({ width }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        function drawCurves() {
            canvas.draw();
        }

        window.addEventListener("scroll", drawCurves);

        canvas.setCanvas(canvasRef.current);

        drawCurves();

        return () => {
            window.removeEventListener("scroll", drawCurves);
        };
    });

    return (
        <canvas
            width={width}
            className={[st["canvas"]].join(" ")}
            ref={canvasRef}
        ></canvas>
    );
}

export default observer(CanvasForCurves);
