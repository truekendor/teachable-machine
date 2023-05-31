import { observer } from "mobx-react-lite";
import { useRef, useContext, useId, useState } from "react";

import { Context } from "../../index";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import st from "./CardForm.module.css";
import { CardContext } from "../Card/Card";

function CardForm() {
    const { store } = useContext(Context);
    const { queue } = useContext(CardContext);

    const [inputValue, setInputValue] = useState(store.labelsArray[queue]);

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
                value={inputValue}
                // defaultValue={store.labelsArray[queue]}
                className={[st["input"]].join(" ")}
                ref={inputRef}
                onKeyDown={(e) => {
                    if (!isValidKeyCode(e.code)) return;

                    inputRef.current.blur();
                }}
                onBlur={() => {
                    store.changeLabelAtIndex(inputValue, queue);
                }}
                onClick={() => {
                    inputRef.current.select();
                }}
                onChange={(e) => {
                    setInputValue(e.target.value);
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
