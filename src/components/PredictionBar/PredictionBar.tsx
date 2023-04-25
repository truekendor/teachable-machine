import { useContext } from "react";
import st from "./PredictionBar.module.css";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

interface Props {
    value: number;
    name: string;
}

function PredictionBar({ value, name }: Props) {
    return (
        <div
            style={
                {
                    "--percent": `${value * 100 > 1 ? value * 100 : 0}%`,
                } as React.CSSProperties
            }
            className={`${st["bar"]}`}
        >
            {name}
        </div>
    );
}

export default observer(PredictionBar);
