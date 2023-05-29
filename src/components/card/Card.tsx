import { observer } from "mobx-react-lite";

import { useRef, useContext, useEffect, createContext } from "react";
import useDebounce from "../../hooks/useDebounce";

import CameraEnableBtn from "../UI/CameraEnableBtn/CameraEnableBtn";
import VideoContainer from "../VideoContainer/VideoContainer";
import SnapshotsContainer from "../SnapshotsContainer/SnapshotsContainer";
import CardForm from "../CardForm/CardForm";

import { Context } from "../../index";

import cardStore from "../../store/CardStore";
import neuralStore from "../../store/neuralStore";

import { BoundingBoxPart } from "../../types/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import st from "./Card.module.css";

export const CardContext = createContext(null);

interface Props {
    queue: number;
}
// TODO create card Context form tracking queue
function Card({ queue }: Props) {
    const { store } = useContext(Context);

    const isCurrent = store.currentCard === queue;
    const containerRef = useRef<HTMLDivElement>();

    const debounce = useDebounce(singleClickHandler, 500, () => {
        return !cardStore.wasDoubleClick;
    });

    function singleClickHandler() {
        if (cardStore.wasDoubleClick) return;
        window.confirm("Кликните дважды чтобы удалить элемент");
    }

    function doubleClickHandler() {
        cardStore.setWasDoubleClick(true);

        const agreed = window.confirm(
            `Удалить карточку ${store.labelsArray[queue]}?`
        );

        if (agreed) {
            store.removeLabelByIndex(queue);
            neuralStore.removeLabelByIndex(queue);

            neuralStore.setNumberOfCategories(store.labelsArray.length);
        }

        setTimeout(() => {
            cardStore.setWasDoubleClick(false);
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
            {/* <CardContext.Provider value={{ queue }}> */}
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
            {/* </CardContext.Provider> */}
        </div>
    );
}

export default observer(Card);
