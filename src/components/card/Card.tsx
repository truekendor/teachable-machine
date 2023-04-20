import React, { useRef, useState } from "react";
import st from "./Card.module.css";

interface Props {
    queue: number;
}

export default function Card({ queue }: Props) {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <div className={[st["card"]].join(" ")}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    return false;
                }}
            >
                <input
                    defaultValue={`Class ${queue + 1}`}
                    className={[st["input"]].join(" ")}
                    ref={inputRef}
                    type="text"
                    title="Название класса"
                    onKeyUp={(e) => {
                        if (e.code === "Enter") {
                            inputRef.current.blur();
                        }
                    }}
                    onClick={() => inputRef.current.select()}
                />
            </form>

            <button>Включить камеру</button>
        </div>
    );
}
