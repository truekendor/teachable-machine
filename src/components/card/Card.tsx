import { useRef, useContext, useEffect } from "react";
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
import SnapshotsContainer from "../SnapshotsContainer/SnapshotsContainer";

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

        // выключаем камеру потому что мне кажется что так лучше
        // store.setCurrentCard(-1);
    }, [store.labelsArray.length, queue, store]);

    // TODO выключить видео при создании новой карты
    // TODO и включить его на последней

    return (
        <div ref={containerRef} className={[st["card"]].join(" ")}>
            <header className={[st["header"]].join(" ")}>
                <CardForm queue={queue} />
                {
                    <button
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
