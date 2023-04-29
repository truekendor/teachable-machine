import { useRef, useContext, useEffect, useState } from "react";
import st from "./Card.module.css";
import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import CardForm from "../CardForm/CardForm";
import VideoContainer from "../VideoContainer/VideoContainer";
import { Context } from "../../index";
import { v4 } from "uuid";

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

        const agreed = window.confirm(
            `Удалить карточку ${store.labelsArray[queue]}?`
        );

        if (agreed) {
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

    // TODO выключить видео при создании новой карты
    // TODO и включить его на последней

    return (
        <div ref={containerRef} className={[st["card"]].join(" ")}>
            <header className={[st["header"]].join(" ")}>
                <CardForm queue={queue} />
                {!store.isModelTrained && (
                    <button
                        onDoubleClick={doubleClickHandler}
                        onClick={debounce}
                        className={`${st["delete-btn"]}`}
                        title="delete"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )}
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
                        <div>
                            количество: {store.samplesAmountArray[queue] || 0}
                        </div>
                        <div className={[st["image-container"]].join(" ")}>
                            {store.base64Array[queue] &&
                                store.base64Array[queue]
                                    ?.slice()
                                    ?.reverse()
                                    .map((base64, i) => {
                                        return (
                                            <img
                                                className={[
                                                    st["training-input-img"],
                                                ].join(" ")}
                                                key={v4()}
                                                src={base64}
                                                alt="data"
                                            />
                                        );
                                    })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default observer(Card);
