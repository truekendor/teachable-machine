// * hooks
import { useContext } from "react";

// * stores/contexts
import { CardContext } from "../Card/Card";
import { Context } from "../../index";

// * components
import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import VideoContainer from "../VideoContainer/VideoContainer";
import SnapshotsContainer from "../SnapshotsContainer/SnapshotsContainer";

// * styles/icons
import st from "./CardBody.module.css";

export default function CardBody() {
    const { store } = useContext(Context);
    const { isCurrent, queue } = useContext(CardContext);

    return (
        <div className={[st["card-body"]].join(" ")}>
            {!isCurrent && (
                <CameraEnableBtn
                    onClick={() => {
                        store.setCurrentCard(queue);
                    }}
                />
            )}
            <VideoContainer />
            {isCurrent && <SnapshotsContainer />}
        </div>
    );
}
