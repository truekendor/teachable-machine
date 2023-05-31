import { observer } from "mobx-react-lite";

// * hooks
import { useRef, useContext, useEffect, createContext } from "react";
import useDebounce from "../../hooks/useDebounce";

// * components
import CardBody from "../CardBody/CardBody";
import CardHeader from "../CardHeader/CardHeader";

// * stores && contexts
import { Context } from "../../index";

import cardStore from "../../store/CardStore";
import neuralStore from "../../store/neuralStore";

// * styles && icons
import st from "./Card.module.css";

// * others
import { BoundingBoxPart } from "../../types/types";

export const CardContext = createContext(null);

interface Props {
    queue: number;
}

function Card({ queue }: Props) {
    const { store } = useContext(Context);
    const isCurrent = store.currentCard === queue;

    const containerRef = useRef<HTMLDivElement>();

    const debounce = useDebounce(singleClickHandler, 500, () => {
        return !cardStore.wasDoubleClick;
    });

    useEffect(() => {
        const bBox: BoundingBoxPart = {
            node: containerRef.current,
        };

        store.setCardBoundingBoxByIndex(queue, bBox);
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

    return (
        <div ref={containerRef} className={st["card"]}>
            <CardContext.Provider
                value={{
                    queue,
                    isCurrent,
                }}
            >
                <CardHeader
                    onClick={debounce}
                    onDoubleClick={doubleClickHandler}
                />

                <CardBody />
            </CardContext.Provider>
        </div>
    );
}

export default observer(Card);
