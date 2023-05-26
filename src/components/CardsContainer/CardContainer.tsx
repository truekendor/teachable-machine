import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import Card from "../Card/Card";
import NewCardBtn from "../UI/NewCardBtn/NewCardBtn";

import { v4 } from "uuid";

import st from "./CardContainer.module.css";
import cardStore from "../../store/CardStore";
import neuralStore from "../../store/neuralStore";

function CardContainer() {
    const { store } = useContext(Context);

    function clickHandler() {
        store.pushToLabels(`Class ${cardStore.getNextClassNumber()}`);

        neuralStore.setNumberOfCategories(store.labelsArray.length);
        neuralStore.setupModel();

        cardStore.setNewCardAdded(true);
    }

    return (
        <div className={[st["container"]].join(" ")}>
            {store.labelsArray.map((el, index) => {
                return <Card key={v4()} queue={index} />;
            })}

            <NewCardBtn hidden={false} onClick={clickHandler} />
        </div>
    );
}

export default observer(CardContainer);
