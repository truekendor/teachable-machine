import st from "./DropDownMenuItem.module.css";

type Props = {
    onClick: () => void;
    value: string;
};

export default function DropDownMenuItem({ onClick, value }: Props) {
    return (
        <li
            className={[st["menu-item"]].join(" ")}
            onClick={(e) => {
                e.stopPropagation();
                return onClick();
            }}
        >
            {value}
        </li>
    );
}
