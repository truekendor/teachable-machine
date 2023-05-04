import { observer } from "mobx-react-lite";
import { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../..";
import { v4 } from "uuid";

import st from "./DropDownMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { TrainingProps } from "../../store/Store";
import { infoText } from "../../utils/infoText";

type Props = {
    list: string[];
    onChoose: (val: string) => void;
    title: string;
    helpText?: string;
    propName: keyof TrainingProps;
};

function DropDownMenu({ list, title, onChoose, propName, helpText }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { store } = useContext(Context);

    // так как лист содержит знак "%", то обрабатываем иначе
    const isValidation = propName === "validationSplit";

    const menuRef = useRef<HTMLDivElement>();

    useEffect(() => {
        function mouseDownHandler(e: MouseEvent) {
            // @ts-ignore - TS понятия не имеет что говорит
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

            <div className={st["test"]}>
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
                            ? `${store.trainingOptions[propName] * 100}%`
                            : store.trainingOptions[propName]}
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
                            {list.map((value) => {
                                return (
                                    <li
                                        className={[st["menu-item"]].join(" ")}
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            setIsOpen(false);
                                            onChoose(value);
                                        }}
                                        key={v4()}
                                    >
                                        {value}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div data-info-text={helpText} className={st["more-info"]}>
                    <FontAwesomeIcon
                        className={st["cosmetic"]}
                        icon={faQuestion}
                    />
                </div>
            </div>
        </div>
    );
}

export default observer(DropDownMenu);
