import { useContext } from "react";
import { Context } from "../../index";

import { observer } from "mobx-react-lite";

import st from "./TrainingOptions.module.css";
import DropDownSet from "./Lists/DropDownSet";
import LabelSet from "./Lists/LabelSet";

function TrainingOptions() {
    const { store } = useContext(Context);

    return (
        <div className={[st["options"]].join(" ")}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className={[st["options-form"]].join(" ")}
            >
                <DropDownSet />
                <LabelSet />
            </form>
        </div>
    );
}

export default observer(TrainingOptions);
