import { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import Card from "../Card/Card";
import NewCardBtn from "../UI/NewCardBtn/NewCardBtn";

import { v4 } from "uuid";

import st from "./CardContainer.module.css";

type Props = {};

function CardContainer({}: Props) {
    const { store } = useContext(Context);

    return (
        <div className={[st["container"]].join(" ")}>
            {store.labelsArray.map((el, index) => {
                return <Card key={v4()} queue={index} />;
            })}

            <NewCardBtn
                hidden={store.isModelTrained}
                onClick={() => {
                    store.pushToLabels(`Class ${store.labelsArray.length + 1}`);
                }}
            />
        </div>
    );
}

export default observer(CardContainer);