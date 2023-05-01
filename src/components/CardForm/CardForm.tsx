import React, { useRef, useContext, useId, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../index";

import st from "./CardForm.module.css";
import { observer } from "mobx-react-lite";

interface Props {
    queue: number;
}

function CardForm({ queue }: Props) {
    const { store } = useContext(Context);
    const inputRef = useRef<HTMLInputElement>();
    const id = useId();

    function isValidKeyCode(code: string) {
        return code === "Enter" || code === "Escape" || code === "Tab";
    }

    function isSwitchToOtherForm(e: React.KeyboardEvent<HTMLInputElement>) {
        const switchCodes =
            (e.code === "Enter" && e.shiftKey) || e.code === "Tab";

        return switchCodes;
    }

    useEffect(() => {
        const isThisCardLastAtQueue = store.labelsArray.length - 1 === queue;

        if (isThisCardLastAtQueue && store.newCardAdded) {
            inputRef.current.select();
            store.setNewCardAdded(false);
        }

        if (queue === store.switchFrom + 1 && !store.formSwitched) {
            store.setFormSwitched(true);

            setTimeout(() => {
                inputRef.current.select();
            }, 5);
        } else if (queue === store.labelsArray.length - 1) {
            store.setSwitchFrom(-1);
        }
    }, [store.switchFrom, queue, store]);

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
                        store.setSwitchFrom(queue);
                        store.setFormSwitched(false);
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
                    store.setSwitchFrom(queue);

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
