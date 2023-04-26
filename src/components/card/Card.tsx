import { useRef, useContext, useEffect } from "react";
import st from "./Card.module.css";
import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import CardForm from "../CardForm/CardForm";
import VideoContainer from "../VideoContainer/VideoContainer";
import { Context } from "../../index";

import { observer } from "mobx-react-lite";
import { BoundingBoxPart } from "../../types/types";

interface Props {
    queue: number;
}

function Card({ queue }: Props) {
    const { store } = useContext(Context);
    const isCurrent = store.currentCard === queue;
    const containerRef = useRef<HTMLDivElement>();

    useEffect(() => {
        const { height } = containerRef.current.getBoundingClientRect();

        // TODO переделать с передачей не всей ноды, а только offsetTop
        // TODO почему-то не работает, но сейчас 6 утра
        const bBox: BoundingBoxPart = {
            height,
            node: containerRef.current,
        };

        store.setCardBoundingBoxByIndex(queue, bBox);
    });

    function deleteCardHandler() {
        //
    }

    return (
        <div ref={containerRef} className={[st["card"]].join(" ")}>
            <header
                className={[st["header"]].join(" ")}
                // TODO сделать переключение инпутов карточек по нажатию TAB
            >
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
