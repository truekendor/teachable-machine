// * external modules
import { observer } from "mobx-react-lite";

// * hooks
import { useRef, useContext, useEffect } from "react";

// * stores & contexts
import { Context } from "../../index";
import { MirrorContext } from "../CardsContainer/CardContainer";

// * components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataCollectorBtn from "../UI/DataCollectorBtn/DataCollectorBtn";
import Webcam from "../Webcam/Webcam";

// * styles/icons
import st from "./VideoContainer.module.css";
import { faLeftRight, faXmark } from "@fortawesome/free-solid-svg-icons";

// * other
import { videoConstrains } from "../../App";
import { gatherDataForVideoContainer } from "../../utils/utils";

interface Props {
    queue: number;
}

function VideoContainer({ queue }: Props) {
    const { store } = useContext(Context);
    const { toggleMirror } = useContext(MirrorContext);

    const isCurrent = store.currentCard === queue;

    const stream = useRef<MediaStream>();
    const camRef = useRef<HTMLVideoElement>();
    const canvasRef = useRef<HTMLCanvasElement>();

    function disableViaMicrotask() {
        queueMicrotask(disableCamera);
        store.setCurrentCard(-1);
    }

    useEffect(() => {
        async function handleCamera() {
            if (!isCurrent || store.currentCard === -1) {
                disableCamera();
                return;
            }

            // На всякий
            if (!store.isCameraReady) {
                await enableCamera();
            }
        }

        handleCamera();

        return () => {
            if (!isCurrent) {
                disableCamera();
            }
        };
    });

    function userHasCamera() {
        return !!navigator?.mediaDevices?.getUserMedia;
    }

    async function enableCamera() {
        if (!userHasCamera()) {
            console.warn("Камера не поддерживается вашим браузером");
            return;
        }

        const result = await navigator.mediaDevices.getUserMedia(
            videoConstrains
        );
        stream.current = result;
        camRef.current.srcObject = result;

        camRef.current.addEventListener("loadeddata", () => {
            store.setIsCameraReady(true);
        });
    }

    function disableCamera() {
        store.setIsCameraReady(false);

        stream?.current?.getTracks?.().forEach((track) => track.stop());
    }

    function dataGatherLoop() {
        const breakCondition = !store.isGatheringData || !store.isCameraReady;

        if (breakCondition) {
            // there is no need to call cancelAnimationFrame
            // since we don't call requestAnimationFrame
            return;
        }

        gatherDataForVideoContainer({
            camera: camRef.current,
            canvas: canvasRef.current,
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
                    <button onClick={toggleMirror}>
                        <FontAwesomeIcon icon={faLeftRight} />
                    </button>
                    <button onClick={disableViaMicrotask}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            )}
            <Webcam isCurrent={isCurrent} ref={camRef} />
            {isCurrent && <DataCollectorBtn onMouseDown={dataGatherLoop} />}
            <canvas
                className={[st["canvas"], st["visually-hidden"]].join(" ")}
                ref={canvasRef}
            ></canvas>
        </div>
    );
}

export default observer(VideoContainer);
