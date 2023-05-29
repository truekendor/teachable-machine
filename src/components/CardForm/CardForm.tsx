import { observer } from "mobx-react-lite";
import React, { useRef, useContext, useId, useEffect } from "react";

import { Context } from "../../index";
import cardStore from "../../store/CardStore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import st from "./CardForm.module.css";
import { CardContext } from "../Card/Card";

interface Props {
    queue: number;
}

function CardForm({ queue }: Props) {
    const { store } = useContext(Context);
    // const { queue } = useContext(CardContext);

    const inputRef = useRef<HTMLInputElement>();
    const id = useId();

    function isValidKeyCode(code: string) {
        return code === "Enter" || code === "Escape";
    }

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
