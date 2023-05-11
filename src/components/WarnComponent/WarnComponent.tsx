import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "../../store/Store";

export default function ProgressBar() {
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
