import { observer } from "mobx-react-lite";
import { useRef, useContext, useEffect } from "react";

import webcamStore from "../../store/Webcam";
import { Context } from "../../index";

import { videoConstrains } from "../../App";

import st from "./VideoCanvas.module.css";
import { CardContext } from "../Card/Card";

type Props = {
    queue: number;
};

function VideoCanvas() {
    const { store } = useContext(Context);
    const { queue, isCurrent } = useContext(CardContext);

    useEffect(() => {
        async function handleCamera() {
            if (isCurrent) {
                await enableCamera();
                animateCanvas();
            }
        }
        handleCamera();
    });

    const canvasRef = useRef<HTMLCanvasElement>();

    // const isCurrent = store.currentCard === queue;

    async function enableCamera() {
        canvasRef.current.width = videoConstrains.width;
        canvasRef.current.height = videoConstrains.height;

        await webcamStore.enableCamera(canvasRef.current);
    }

    function animateCanvas() {
        try {
            if (!isCurrent) {
                return;
            }

            const c = canvasRef.current.getContext("2d");

            if (!webcamStore.isFlipped) {
                c.translate(canvasRef.current.width, 0);
                c.scale(-1, 1);

                webcamStore.setIsFlipped(true);
            }

            c.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
            c.drawImage(
                webcamStore.camera,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );

            window.requestAnimationFrame(animateCanvas);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return (
        <canvas
            width={videoConstrains.width}
            height={videoConstrains.height}
            className={[st["canvas"]].join(" ")}
            ref={canvasRef}
        ></canvas>
    );
}

export default observer(VideoCanvas);
