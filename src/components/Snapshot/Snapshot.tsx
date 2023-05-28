import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import st from "./Snapshot.module.css";

type Props = {
    onClick: () => void;
    mirror: boolean;
    base64: string;
};

export default function Snapshot({ onClick, mirror, base64 }: Props) {
    return (
        <div className={[st["image-container"]].join(" ")}>
            <button onClick={onClick} className={[st["delete-btn"]].join(" ")}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <img
                className={[st["img"], mirror && st["swap"]].join(" ")}
                src={base64}
                alt="data sample for class"
            />
        </div>
    );
}
