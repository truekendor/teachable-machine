import { useEffect, useRef } from "react";
import webcamStore from "../../store/Webcam";

export function Webcam() {
    const camRef = useRef<HTMLVideoElement>();

    useEffect(() => {
        webcamStore.setWebcam(camRef.current);
    });

    return (
        <video autoPlay={true} className="visually-hidden" ref={camRef}></video>
    );
}
