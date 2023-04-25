import { useState, useContext, useEffect } from "react";
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
    const isCurrent = store.currentCard === queue;

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
                {!isCurrent && !store.isModelTrained && (
                    <CameraEnableBtn
                        onClick={() => {
                            store.setCurrentCard(queue);
                        }}
                    />
                )}
                <VideoContainer queue={queue} />
                {
                    <p style={{ width: "100px" }}>
                        количество: {store.amountArray[queue] || 0}
                    </p>
                }
                {isCurrent && (
                    <div
                        className={[st["snapshots-container"]].join(" ")}
                    ></div>
                )}
            </div>
        </div>
    );
}

export default observer(Card);
