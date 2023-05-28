import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";

import st from "./DropDownMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faQuestion } from "@fortawesome/free-solid-svg-icons";
import neuralStore, { TrainingOptions } from "../../store/neuralStore";
import DropDownMenuItem from "../DropDownMenuItem/DropDownMenuItem";

type Props = {
    list: string[];
    onChoose: (val: string) => void;
    title: string;
    helpText?: string;
    propName: keyof TrainingOptions;
};

function DropDownMenu({ list, title, onChoose, propName, helpText }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // corner case since valSplit comes with "%"
    const isValidation = propName === "validationSplit";

    const menuRef = useRef<HTMLDivElement>();

    useEffect(() => {
        function mouseDownHandler(e: MouseEvent) {
            // @ts-ignore
            if (!menuRef.current.contains(e.target)) setIsOpen(false);
        }

        document.addEventListener("mousedown", mouseDownHandler);

        return () => {
            document.removeEventListener("mousedown", mouseDownHandler);
        };
    });

    return (
        <div className={st["menu-container"]}>
            <h4 className={st["title"]}>{title}</h4>

            <div className={st["main-content"]}>
                <div
                    ref={menuRef}
                    className={[
                        st["trigger"],
                        isOpen ? st["menu-active"] : "",
                    ].join(" ")}
                    tabIndex={1}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <p>
                        {isValidation
                            ? `${neuralStore.trainingOptions[propName] * 100}%`
                            : neuralStore.trainingOptions[propName]}
                    </p>
                    <div className={st["icon"]}>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>

                    <div
                        className={[
                            st["menu"],
                            isOpen ? st["active"] : "",
                        ].join(" ")}
                    >
                        <ul>
                            {list.map((value) => (
                                <DropDownMenuItem
                                    key={v4()}
                                    value={value}
                                    onClick={() => {
                                        setIsOpen(false);
                                        onChoose(value);
                                    }}
                                />
                            ))}
                        </ul>
                    </div>
                </div>

                <div data-info-text={helpText} className={st["more-info"]}>
                    <FontAwesomeIcon
                        className={st["question"]}
                        icon={faQuestion}
                    />
                </div>
            </div>
        </div>
    );
}

export default observer(DropDownMenu);
