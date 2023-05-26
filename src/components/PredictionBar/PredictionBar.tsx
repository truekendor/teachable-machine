import { observer } from "mobx-react-lite";

import st from "./PredictionBar.module.css";

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
            <p>{name}</p>
        </div>
    );
}

export default observer(PredictionBar);
