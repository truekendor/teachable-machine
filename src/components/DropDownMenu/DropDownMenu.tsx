import { observer } from "mobx-react-lite";
import { useState, useContext, useEffect, useRef } from "react";
import { v4 } from "uuid";

import st from "./DropDownMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
    list: string[];
    onChoose: (val: string) => void;
    title: string;
};

function DropDownMenu({ list, title, onChoose }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(list[0]);

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
            <div
                ref={menuRef}
                className={[
                    st["trigger"],
                    isOpen ? st["menu-active"] : "",
                ].join(" ")}
                tabIndex={1}
                onClick={() => setIsOpen(!isOpen)}
            >
                <p>{value}</p>
                <div className={st["icon"]}>
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
                <div
                    className={[st["menu"], isOpen ? st["active"] : ""].join(
                        " "
                    )}
                >
                    <ul>
                        {list.map((value) => {
                            return (
                                <li
                                    className={[st["menu-item"]].join(" ")}
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        setIsOpen(false);
                                        setValue(value);

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
        </div>
    );
}

export default observer(DropDownMenu);
