import { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../../index";

import st from "./CameraEnableBtn.module.css";
import { observer } from "mobx-react-lite";

interface Props {
    onClick: () => void;
}

function CameraEnableBtn({ onClick }: Props) {
    return (
        <button className={[st["cam-enable-btn"]].join(" ")} onClick={onClick}>
            <FontAwesomeIcon className={st["icon"]} icon={faVideoCamera} />
            Веб-камера
        </button>
    );
}

export default observer(CameraEnableBtn);
