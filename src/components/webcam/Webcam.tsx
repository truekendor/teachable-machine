import React from "react";
import st from "./Webcam.module.css";

export default function Webcam() {
    return <video autoPlay className={[st["video"]].join(" ")}></video>;
}
