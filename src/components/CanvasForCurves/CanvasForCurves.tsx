import { useCallback, useContext, useEffect, useRef } from "react";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

import canvas from "../../store/Canvas";

import st from "./CanvasForCurves.module.css";

type Props = {
    width: number;
};

function CanvasForCurves({ width }: Props) {
    const { store } = useContext(Context);

    const canvasRef = useRef<HTMLCanvasElement>();

    const drawCurves = useCallback(() => {
        queueMicrotask(() => {
            canvas.draw();
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", drawCurves);

        canvas.setCanvas(canvasRef.current);
        canvas.setWidth(width);

        drawCurves();

        return () => {
            window.removeEventListener("scroll", drawCurves);
        };
    });

    return (
        // <div className={[st["container"]].join(" ")}>
        <canvas className={[st["canvas"]].join(" ")} ref={canvasRef}></canvas>
        // </div>
    );
}

export default observer(CanvasForCurves);
