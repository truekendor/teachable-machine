// * external modules
import { observer } from "mobx-react-lite";

// * hooks
import { useRef, useContext, useEffect } from "react";

// * stores & contexts
import { Context } from "../../index";
import webcamStore from "../../store/Webcam";
import { CardContext } from "../Card/Card";

// * components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataCollectorBtn from "../UI/DataCollectorBtn/DataCollectorBtn";
import VideoCanvas from "../VideoCanvas/VideoCanvas";

// * styles/icons
import st from "./VideoContainer.module.css";
import { faLeftRight, faXmark } from "@fortawesome/free-solid-svg-icons";

// * others
import { videoConstrains } from "../../App";
import { gatherDataForVideoContainer } from "../../utils/utils";

function VideoContainer() {
    const { store } = useContext(Context);
    const { isCurrent, queue } = useContext(CardContext);

    const canvasMinifierRef = useRef<HTMLCanvasElement>();
    const canvasRef = useRef<HTMLCanvasElement>();
    const ctxRef = useRef<CanvasRenderingContext2D>();

    useEffect(() => {
        async function handleCamera() {
            if (isCurrent) {
                await enableCamera();
                animateCanvas();
            }
        }
        handleCamera();
        ctxRef.current = canvasRef.current.getContext("2d");
    });

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

            // const c = canvasRef.current.getContext("2d");

            if (!webcamStore.isFlipped) {
                ctxRef.current.translate(canvasRef.current.width, 0);
                ctxRef.current.scale(-1, 1);

                webcamStore.setIsFlipped(true);
            }

            ctxRef.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
            ctxRef.current.drawImage(
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

    // TODO replace with useInterval
    function dataGatherLoop() {
        const breakCondition =
            !store.isGatheringData || !webcamStore.isCameraReady;

        if (breakCondition) {
            // there is no need to call cancelAnimationFrame
            // since we don't call requestAnimationFrame
            return;
        }

        gatherDataForVideoContainer({
            camera: webcamStore.camera,
            canvas: canvasMinifierRef.current,
            queue,
        });

        window.requestAnimationFrame(dataGatherLoop);
    }

    return (
        <div
            className={[
                st["video-container"],
                isCurrent ? st["current"] : "visually-hidden",
            ].join(" ")}
        >
            {isCurrent && (
                // TODO decompose me
                <div className={[st["top-panel"]].join(" ")}>
                    <button
                        onClick={() => {
                            webcamStore.toggleIsMirror();
                            webcamStore.setIsFlipped(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faLeftRight} />
                    </button>
                    <button
                        onClick={() => {
                            store.setCurrentCard(-1);
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            )}

            <canvas
                width={videoConstrains.width}
                height={videoConstrains.height}
                className={[st["canvas"]].join(" ")}
                ref={canvasRef}
            ></canvas>

            {isCurrent && <DataCollectorBtn onMouseDown={dataGatherLoop} />}
            <canvas
                className={[st["canvas-mini"]].join(" ")}
                ref={canvasMinifierRef}
            ></canvas>
        </div>
    );
}

export default observer(VideoContainer);
