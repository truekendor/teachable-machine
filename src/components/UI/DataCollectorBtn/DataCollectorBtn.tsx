import { useContext } from "react";
import { Context } from "../../../index";

import st from "./DataCollectorBtn.module.css";
import { observer } from "mobx-react-lite";

type Props = {
    onMouseDown: () => void;
};

function DataCollectorBtn({ onMouseDown }: Props) {
    const { store } = useContext(Context);

    return (
        <button
            disabled={!store.isCameraReady}
            className={`${st["record-btn"]}`}
            onMouseDown={() => {
                store.setIsGatheringData(true);
                onMouseDown();
            }}
            onMouseUp={() => {
                store.setIsGatheringData(false);
            }}
            onMouseLeave={() => {
                store.setIsGatheringData(false);
            }}
        >
            Удерживайте для записи
        </button>
    );
}

export default observer(DataCollectorBtn);
