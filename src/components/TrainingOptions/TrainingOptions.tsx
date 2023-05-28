import { observer } from "mobx-react-lite";

import DropDownSet from "./Lists/DropDownSet";
import LabelSet from "./Lists/LabelSet";

import st from "./TrainingOptions.module.css";

function TrainingOptions() {
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
