import { useRef, useContext, useEffect, useState } from "react";

import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import VideoContainer from "../VideoContainer/VideoContainer";
import SnapshotsContainer from "../SnapshotsContainer/SnapshotsContainer";
import CardForm from "../CardForm/CardForm";

import { Context } from "../../index";
import useDebounce from "../../hooks/useDebounce";

import { observer } from "mobx-react-lite";
import { BoundingBoxPart } from "../../types/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import "../../index.css";
import st from "./Card.module.css";

interface Props {
    queue: number;
}

function Card({ queue }: Props) {
    const { store } = useContext(Context);

    const isCurrent = store.currentCard === queue;
    const containerRef = useRef<HTMLDivElement>();

    const debounce = useDebounce(singleClickHandler, 500, () => {
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
        const bBox: BoundingBoxPart = {
            node: containerRef.current,
        };

        store.setCardBoundingBoxByIndex(queue, bBox);
    });

    return (
        <div ref={containerRef} className={[st["card"]].join(" ")}>
            <header className={[st["header"]].join(" ")}>
                <CardForm queue={queue} />
                {
                    <button
                        // TODO
                        // * ============
                        // onClick={() => {
                        //     setIsOptionsOpen(!isOptionsOpen);
                        // }}
                        // * ============
                        onDoubleClick={doubleClickHandler}
                        onClick={debounce}
                        className={`${st["delete-btn"]}`}
                        title="delete"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                }
            </header>
            <div className={[st["card-body"]].join(" ")}>
                {!isCurrent && (
                    <CameraEnableBtn
                        onClick={() => {
                            store.setCurrentCard(queue);
                        }}
                    />
                )}
                <VideoContainer queue={queue} />

                {isCurrent && <SnapshotsContainer queue={queue} />}
            </div>
        </div>
    );
}

export default observer(Card);
