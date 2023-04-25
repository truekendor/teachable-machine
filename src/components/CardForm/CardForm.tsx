import { useRef, useContext } from "react";

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

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                return false;
            }}
            className={[st["form"]].join(" ")}
        >
            <input
                id={`${queue}-input`}
                defaultValue={`Class ${queue + 1}`}
                className={[st["input"]].join(" ")}
                ref={inputRef}
                onKeyUp={(e) => {
                    if (e.code === "Enter") {
                        inputRef.current.blur();
                    }
                }}
                onBlur={() => {
                    store.changeLabelAtIndex(inputRef.current.value, queue);
                }}
                onClick={() => inputRef.current.select()}
                type="text"
                title="Название класса"
            />
            <label htmlFor={`${queue}-input`}>
                <FontAwesomeIcon
                    className={`${st["icon"]}`}
                    icon={faPenToSquare}
                />
            </label>
        </form>
    );
}

export default observer(CardForm);
