import { useContext } from "react";
import { Context } from "../../../index";

import { observer } from "mobx-react-lite";
import webcamStore from "../../../store/Webcam";

import st from "./DataCollectorBtn.module.css";

type Props = {
    onMouseDown: () => void;
};

function DataCollectorBtn({ onMouseDown }: Props) {
    const { store } = useContext(Context);

    return (
        <button
            disabled={!webcamStore.isCameraReady}
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
