// * external modules
import { observer } from "mobx-react-lite";

// * hooks
import { useRef, useContext, useEffect } from "react";

// * stores & contexts
import { Context } from "../../index";
import webcamStore from "../../store/Webcam";

// * components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataCollectorBtn from "../UI/DataCollectorBtn/DataCollectorBtn";

// * styles/icons
import st from "./VideoContainer.module.css";
import { faLeftRight, faXmark } from "@fortawesome/free-solid-svg-icons";

// * other
import { videoConstrains } from "../../App";
import { gatherDataForVideoContainer } from "../../utils/utils";

interface Prop {
    queue: number;
}

function VideoContainer({ queue }: Prop) {
    const { store } = useContext(Context);
    // const { queue } = useContext(CardContext);

    const isCurrent = store.currentCard === queue;

    const canvasMinifierRef = useRef<HTMLCanvasElement>();
    const canvasRef = useRef<HTMLCanvasElement>();

    // TODO deprecated?
    useEffect(() => {
        async function handleCamera() {
            if (isCurrent) {
                await enableCamera();
                animateCanvas();
            }
        }
        handleCamera();
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
        } catch {
            //
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
            className={[st["video-container"], isCurrent && st["current"]].join(
                " "
            )}
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
                    <button onClick={() => store.setCurrentCard(-1)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            )}
            {/* 
            // ! new element
            */}
            {isCurrent && (
                <div className={`${st["wrapper"]}`}>
                    <canvas
                        className={[st["canvas-instead"]].join(" ")}
                        ref={canvasRef}
                    ></canvas>
                </div>
            )}
            {isCurrent && <DataCollectorBtn onMouseDown={dataGatherLoop} />}
            <canvas
                className={[st["canvas"], st["visually-hidden"]].join(" ")}
                ref={canvasMinifierRef}
            ></canvas>
        </div>
    );
}

export default observer(VideoContainer);
