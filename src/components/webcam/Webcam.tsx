import { useContext, useRef, forwardRef } from "react";

import st from "./Webcam.module.css";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

interface Props {
    isCurrent: boolean;
}

const Webcam = forwardRef(function (
    { isCurrent }: Props,
    ref: React.LegacyRef<HTMLVideoElement>
) {
    const { store } = useContext(Context);

    function setClasses() {
        if (isCurrent && !store.isCameraReady) {
            return st["waiting"];
        }
    }

    return (
        <div className={[st["container"], setClasses()].join(" ")}>
            <video
                ref={ref}
                autoPlay={true}
                className={[
                    st["video"],
                    (!isCurrent || !store.isCameraReady) &&
                        st["visually-hidden"],
                ].join(" ")}
            ></video>
        </div>
    );
});

export default observer(Webcam);
