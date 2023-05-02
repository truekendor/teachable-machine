import { useContext } from "react";
import { Context } from "../../../../index";

import { observer } from "mobx-react-lite";

import st from "./OptionsBtn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

type Props = {
    onClick: () => void;
    expandOpt: boolean;
};
function OptionsBtn({ onClick, expandOpt }: Props) {
    const { store } = useContext(Context);

    return (
        <button
            disabled={store.isModelTrained}
            className={[
                st["options-btn"],
                expandOpt || store.isModelTrained ? st["expanded"] : "",
            ].join(" ")}
            onClick={onClick}
        >
            дополнительно{"  "}
            <FontAwesomeIcon
                className={[st["icon"], expandOpt ? st["rotate"] : ""].join(
                    " "
                )}
                icon={faCaretDown}
            />
        </button>
    );
}

export default observer(OptionsBtn);
