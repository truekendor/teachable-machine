import { makeAutoObservable } from "mobx";
import { videoConstrains } from "../App";

export class Webcam {
    camera: HTMLVideoElement;
    stream: MediaStream;

    isCameraReady: boolean;

    isFlipped = false;
    isMirror = true;

    currentCanvas: HTMLCanvasElement;

    constructor() {
        makeAutoObservable(this);

        this.userHasCamera();
    }

    setWebcam(ref: HTMLVideoElement) {
        this.camera = ref;
    }

    setCurrentCanvas(canvas: HTMLCanvasElement) {
        this.currentCanvas = canvas;
    }

    async enableCamera(canvasRef: HTMLCanvasElement) {
        if (!this.userHasCamera()) {
            console.warn("The camera is not supported by your browser");
            return;
        }

        this.setCurrentCanvas(canvasRef);

        if (!this.stream) {
            const result = await navigator.mediaDevices.getUserMedia(
                videoConstrains
            );

            this.stream = result;
        }

        this.camera.srcObject = this.stream;

        if (this.isMirror) {
            this.setIsFlipped(false);
        }

        this.camera.onloadeddata = () => {
            this.setIsCameraReady(true);
        };
    }

    setIsCameraReady(state: boolean) {
        this.isCameraReady = state;
    }

    toggleIsMirror() {
        this.isMirror = !this.isMirror;
    }

    setIsFlipped(state: boolean) {
        this.isFlipped = state;
    }

    // unused
    closeCamera() {
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    private userHasCamera() {
        return !!navigator?.mediaDevices?.getUserMedia;
    }
}

const webcamStore = new Webcam();

export default webcamStore;
