import { observer } from "mobx-react-lite";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import st from "./OptionsBtn.module.css";

type Props = {
    onClick: () => void;
    expandOpt: boolean;
};
function OptionsBtn({ onClick, expandOpt }: Props) {
    return (
        <button
            className={[
                st["options-btn"],
                expandOpt ? st["expanded"] : "",
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
