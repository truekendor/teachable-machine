import { useContext, useRef, useEffect } from "react";
import st from "./NewCardBtn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";

interface Props {
    onClick: () => void;
    hidden: boolean;
}

function NewCardBtn({ onClick, hidden }: Props) {
    const { store } = useContext(Context);
    const buttonRef = useRef<HTMLButtonElement>();

    useEffect(() => {
        function adjustParentHeight() {
            let size =
                ((buttonRef?.current?.offsetTop || window.innerHeight) /
                    window.innerHeight) *
                    100 -
                10;

            store.setInnerHeight(Math.round(size));
        }

        adjustParentHeight();

        store.setButton(buttonRef.current);
    });

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className={[
                st["new-card-btn"],
                hidden && st["visually-hidden"],
            ].join(" ")}
        >
            <FontAwesomeIcon className={`${st["icon"]}`} icon={faPlusSquare} />
            Добавить класс
        </button>
    );
}

export default observer(NewCardBtn);
