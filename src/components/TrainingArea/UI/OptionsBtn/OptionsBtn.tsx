import { useContext } from "react";
import { Context } from "../../../../index";

import { observer } from "mobx-react-lite";

import st from "./OptionsBtn.module.css";

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
            дополнительно
        </button>
    );
}

export default observer(OptionsBtn);
