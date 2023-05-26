import { useContext } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Context } from "../../index";

export default function ProgressBar() {
    const { store } = useContext(Context);

    return (
        <div className={"warn no-data"}>
            <FontAwesomeIcon icon={faExclamationCircle} /> Данные собраны не для
            всех классов{" "}
            <p className="warn-accent">
                {store.labelsArray[store.indexOfClassWithNoData]}
            </p>
        </div>
    );
}
