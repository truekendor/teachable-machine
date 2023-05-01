import React from "react";
import st from "./Column.module.css";

type Props = {
    children: React.ReactNode;
    width: number;
    min: number;
    max: number;
};

export default function Column({ children, width, min, max }: Props) {
    return (
        <div
            style={
                {
                    width: `${width}rem`,
                    minWidth: `${min}rem`,
                    maxWidth: `${max}rem`,
                } as React.CSSProperties
            }
            className={st["container"]}
        >
            {children}
        </div>
    );
}
