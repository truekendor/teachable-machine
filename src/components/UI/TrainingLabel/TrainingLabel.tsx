import React, { useRef, useId } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import st from "./TrainingLabel.module.css";
import { observer } from "mobx-react-lite";

type Props = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    infoText: string;
    header: string;
    value: string;
    min?: number;
    stroked: boolean;
};

function TrainingLabel({ infoText, onChange, header, value, stroked }: Props) {
    const inputRef = useRef<HTMLInputElement>();
    const id = useId();

    return (
        <label className={st["label"]} htmlFor={id}>
            <h4 className={st["header"]}>{header}</h4>
            <input
                ref={inputRef}
                className={[st["input"], stroked ? st["stroked"] : ""].join(
                    " "
                )}
                onChange={(e) => onChange(e)}
                onKeyDown={(e) => {
                    if (e.code === "Enter") {
                        inputRef?.current?.blur();
                    }
                }}
                value={value}
                disabled={stroked}
                type="number"
                id={id}
            />
            <div data-info-text={infoText} className={st["more-info"]}>
                <FontAwesomeIcon className={st["cosmetic"]} icon={faQuestion} />
            </div>
        </label>
    );
}

export default observer(TrainingLabel);
