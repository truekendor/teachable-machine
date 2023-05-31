// * external modules
import { observer } from "mobx-react-lite";
import { v4 } from "uuid";

// * hooks
import { useContext } from "react";

// * stores/contexts
import { Context } from "../../index";
import neuralStore from "../../store/neuralStore";
import cardStore from "../../store/CardStore";

// * components
import Card from "../Card/Card";
import NewCardBtn from "../UI/NewCardBtn/NewCardBtn";

// * styles/icons
import st from "./CardContainer.module.css";

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
            {store.labelsArray.map((_, index) => {
                return <Card key={v4()} queue={index} />;
            })}

            <NewCardBtn hidden={false} onClick={clickHandler} />
        </div>
    );
}

export default observer(CardContainer);
