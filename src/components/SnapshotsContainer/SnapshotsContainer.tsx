import { useContext } from "react";
import { Context } from "../../index";
import { v4 } from "uuid";

import st from "./SnapshotsContainer.module.css";
import { observer } from "mobx-react-lite";

type Props = { queue: number };

function SnapshotsContainer({ queue }: Props) {
    const { store } = useContext(Context);

    return (
        <div className={[st["snapshots-container"]].join(" ")}>
            <div className={[st["amount-counter"]].join(" ")}>
                Количество образцов: {store.samplesAmountArray[queue] || 0}
            </div>
            <div className={[st["image-container"]].join(" ")}>
                {store.base64Array[queue] &&
                    store.base64Array[queue]
                        ?.slice()
                        ?.reverse()
                        .map((base64) => {
                            return (
                                <img
                                    className={[st["training-input-img"]].join(
                                        " "
                                    )}
                                    key={v4()}
                                    src={base64}
                                    alt="data"
                                />
                            );
                        })}
            </div>
        </div>
    );
}

export default observer(SnapshotsContainer);
