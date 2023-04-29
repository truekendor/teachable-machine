import { useContext, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import Card from "../Card/Card";
import NewCardBtn from "../UI/NewCardBtn/NewCardBtn";

import st from "./CardContainer.module.css";

type Props = {};

function CardContainer({}: Props) {
    const { store } = useContext(Context);

    return (
        <div className={[st["container"]].join(" ")}>
            {store.labelsArray.map((el, index) => {
                return <Card key={index} queue={index} />;
            })}

            <NewCardBtn
                hidden={store.isModelTrained}
                onClick={() =>
                    store.pushToLabels(`Class ${store.labelsArray.length}`)
                }
            />
        </div>
    );
}

export default observer(CardContainer);
