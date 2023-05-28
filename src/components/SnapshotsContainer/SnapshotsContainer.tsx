import { observer } from "mobx-react-lite";
import { v4 } from "uuid";

import { useContext } from "react";

import { Context } from "../../index";
import { MirrorContext } from "../CardsContainer/CardContainer";
import Snapshot from "../Snapshot/Snapshot";

import st from "./SnapshotsContainer.module.css";

type Props = { queue: number };

function SnapshotsContainer({ queue }: Props) {
    const { store } = useContext(Context);
    const { mirror } = useContext(MirrorContext);

    function clickHandler(index: number) {
        // calculate correct index since current one is reversed
        const nonReversedIndex = store.base64Array[queue].length - index - 1;

        store.removeImageByIndex(queue, nonReversedIndex);
    }

    return (
        <div className={[st["snapshots-container"]].join(" ")}>
            <div className={[st["amount-counter"]].join(" ")}>
                Количество образцов: {store.base64Array[queue]?.length || 0}
            </div>
            <div className={[st["image-container"]].join(" ")}>
                {store.base64Array[queue]
                    ?.slice()
                    ?.reverse()
                    .map((base64, index) => {
                        return (
                            <Snapshot
                                key={v4()}
                                base64={base64}
                                onClick={() => clickHandler(index)}
                                mirror={mirror}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

export default observer(SnapshotsContainer);
