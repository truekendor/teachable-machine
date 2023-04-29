import { useRef, useContext, useEffect, useState } from "react";
import st from "./Card.module.css";
import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import CardForm from "../CardForm/CardForm";
import VideoContainer from "../VideoContainer/VideoContainer";
import { Context } from "../../index";

import { observer } from "mobx-react-lite";
import { BoundingBoxPart } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "../../hooks/useDebounce";

interface Props {
    queue: number;
}

function Card({ queue }: Props) {
    const { store } = useContext(Context);

    const isCurrent = store.currentCard === queue;
    const containerRef = useRef<HTMLDivElement>();

    const debounce = useDebounce(singleClickHandler, 500, () => {
        console.log("PASSING DELETE STATE", store.wasDoubleClick);

        return !store.wasDoubleClick;
    });

    function singleClickHandler() {
        if (store.wasDoubleClick) return;
        window.confirm("Кликните дважды чтобы удалить элемент");
    }

    function doubleClickHandler() {
        store.setWasDoubleClick(true);

        const agreed = window.confirm("doubleClick");

        if (agreed) {
            console.log(queue);
            store.removeLabelByIndex(queue);
        }

        setTimeout(() => {
            store.setWasDoubleClick(false);
        }, 5);
    }

    useEffect(() => {
        // TODO переделать с передачей не всей ноды, а только offsetTop
        // TODO почему-то не работает, но сейчас 6 утра
        const bBox: BoundingBoxPart = {
            node: containerRef.current,
        };

        store.setCardBoundingBoxByIndex(queue, bBox);
    }, [store.labelsArray.length, queue, store]);

    return (
        <div ref={containerRef} className={[st["card"]].join(" ")}>
            <header className={[st["header"]].join(" ")}>
                <CardForm queue={queue} />
                <button
                    onDoubleClick={doubleClickHandler}
                    onClick={debounce}
                    className={`${st["delete-btn"]}`}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
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

                {isCurrent && (
                    <div className={[st["snapshots-container"]].join(" ")}>
                        количество: {store.samplesAmountArray[queue] || 0}
                    </div>
                )}
            </div>
        </div>
    );
}

export default observer(Card);
