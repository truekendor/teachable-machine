import { useContext } from "react";
import { Context } from "../../index";
import { v4 } from "uuid";

import st from "./SnapshotsContainer.module.css";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = { queue: number };

function SnapshotsContainer({ queue }: Props) {
    const { store } = useContext(Context);

    return (
        <div className={[st["snapshots-container"]].join(" ")}>
            <div className={[st["amount-counter"]].join(" ")}>
                Количество образцов: {store.base64Array[queue]?.length || 0}
            </div>
            <div className={[st["image-container"]].join(" ")}>
                {store.base64Array[queue] &&
                    store.base64Array[queue]
                        ?.slice()
                        ?.reverse()
                        .map((base64, index) => {
                            return (
                                <div
                                    key={v4()}
                                    className={[st["helper-div"]].join(" ")}
                                >
                                    <button
                                        onClick={() => {
                                            store.removeImageByIndex(
                                                queue,
                                                index
                                            );
                                        }}
                                        className={[st["helper-btn"]].join(" ")}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <img
                                        className={[
                                            st["img"],
                                            store.mirrorWebcam && st["swap"],
                                        ].join(" ")}
                                        src={base64}
                                        alt="data"
                                    />
                                </div>
                            );
                        })}
            </div>
        </div>
    );
}

export default observer(SnapshotsContainer);
