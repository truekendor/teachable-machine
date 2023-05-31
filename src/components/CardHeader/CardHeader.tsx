// * components
import CardForm from "../CardForm/CardForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// * styles/icons
import st from "./CardHeader.module.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Props = {
    onDoubleClick?: () => void;
    onClick?: () => void;
};

export default function CardHeader({ onClick, onDoubleClick }: Props) {
    return (
        <header className={st["header"]}>
            <CardForm />

            <button
                onDoubleClick={onDoubleClick}
                onClick={onClick}
                className={st["delete-btn"]}
                title="delete"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </header>
    );
}
