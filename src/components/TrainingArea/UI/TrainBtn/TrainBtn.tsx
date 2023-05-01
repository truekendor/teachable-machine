import { useContext } from "react";
import { Context } from "../../../../index";

import { observer } from "mobx-react-lite";

import st from "./TrainBtn.module.css";

type Props = {
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
};
function TrainBtn({ onClick, onMouseEnter, onMouseLeave }: Props) {
    const { store } = useContext(Context);

    return (
        <button
            className={[
                st["train-btn"],
                store.allDataGathered ? st["all-gathered"] : "",
            ].join(" ")}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            Обучить модель
        </button>
    );
}

export default observer(TrainBtn);
