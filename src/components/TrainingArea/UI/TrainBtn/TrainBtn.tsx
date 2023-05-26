import { useContext } from "react";
import { Context } from "../../../../index";

import { observer } from "mobx-react-lite";

import st from "./TrainBtn.module.css";
import neuralStore from "../../../../store/neuralStore";

type Props = {
    onClick: () => void;
};
function TrainBtn({ onClick }: Props) {
    const { store } = useContext(Context);

    return (
        <button
            className={[
                st["train-btn"],
                store.isAllDataGathered ? st["all-gathered"] : "",
            ].join(" ")}
            onClick={onClick}
        >
            Обучить модель
        </button>
    );
}

export default observer(TrainBtn);
