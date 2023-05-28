import { observer } from "mobx-react-lite";
import React, { useRef, useContext, useId, useEffect } from "react";

import { Context } from "../../index";
import cardStore from "../../store/CardStore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import st from "./CardForm.module.css";

interface Props {
    queue: number;
}

function CardForm({ queue }: Props) {
    const { store } = useContext(Context);
    const inputRef = useRef<HTMLInputElement>();
    const id = useId();

    function isValidKeyCode(code: string) {
        return code === "Enter" || code === "Escape";
    }

    function isSwitchToOtherForm(e: React.KeyboardEvent<HTMLInputElement>) {
        const switchCodes = e.code === "Enter" && e.shiftKey;

        return switchCodes;
    }

    useEffect(() => {
        const isThisCardLastAtQueue = store.labelsArray.length - 1 === queue;

        if (isThisCardLastAtQueue && cardStore.newCardAdded) {
            inputRef.current.select();
            cardStore.setNewCardAdded(false);
        }

        if (queue === cardStore.switchFrom + 1 && !cardStore.formSwitched) {
            cardStore.setFormSwitched(true);

            setTimeout(() => {
                inputRef.current.select();
            }, 5);
        } else if (queue === store.labelsArray.length - 1) {
            cardStore.setSwitchFrom(-1);
        }
    }, [queue, cardStore]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                return false;
            }}
            className={[st["form"]].join(" ")}
        >
            <input
                id={id}
                defaultValue={store.labelsArray[queue]}
                className={[st["input"]].join(" ")}
                ref={inputRef}
                onKeyDown={(e) => {
                    if (!isValidKeyCode(e.code)) return;

                    if (isSwitchToOtherForm(e)) {
                        cardStore.setSwitchFrom(queue);
                        cardStore.setFormSwitched(false);
                    }

                    // блюр при нажатии на enter
                    inputRef.current.blur();
                }}
                onBlur={() => {
                    const inputValueChanged =
                        inputRef.current.value !== store.labelsArray[queue];

                    if (inputValueChanged) {
                        store.changeLabelAtIndex(inputRef.current.value, queue);
                    }
                }}
                onClick={() => {
                    cardStore.setSwitchFrom(queue);

                    inputRef.current.select();
                }}
                type="text"
                title="Название класса"
            />
            <label htmlFor={id}>
                <FontAwesomeIcon
                    className={`${st["icon"]}`}
                    icon={faPenToSquare}
                />
            </label>
        </form>
    );
}

export default observer(CardForm);
