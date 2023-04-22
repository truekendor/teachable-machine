import { useState, useContext } from "react";
import st from "./Card.module.css";
import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import CardForm from "../CardForm/CardForm";
import VideoContainer from "../VideoContainer/VideoContainer";
import { Context } from "../../index";

import { observer } from "mobx-react-lite";

interface Props {
    queue: number;
}

function Card({ queue }: Props) {
    const { store } = useContext(Context);
    const [isVideoWindowActive, setIsVideoWindowActive] = useState(false);

    function onClickHandler() {
        setIsVideoWindowActive(!isVideoWindowActive);
        store.setCurrentCardWithCamera(queue);
    }

    function deleteCardHandler() {
        //
    }

    return (
        <div className={[st["card"]].join(" ")}>
            <header className={[st["header"]].join(" ")}>
                <CardForm queue={queue} />
                {/* <button
                    onClick={deleteCardHandler}
                    className={`${st["delete-btn"]}`}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button> */}
            </header>
            <div className={[st["card-body"]].join(" ")}>
                {!isVideoWindowActive && !store.isModelTrained && (
                    <CameraEnableBtn onClick={() => onClickHandler()} />
                )}
                <VideoContainer
                    cancelVideo={() => {
                        setIsVideoWindowActive(false);
                    }}
                    queue={queue}
                    isVideoWindowActive={isVideoWindowActive}
                />
                {isVideoWindowActive && (
                    <div
                        className={[st["snapshots-container"]].join(" ")}
                    ></div>
                )}
            </div>
        </div>
    );
}

export default observer(Card);
