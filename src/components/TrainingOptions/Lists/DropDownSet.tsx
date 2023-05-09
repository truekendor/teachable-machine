import { useContext } from "react";
import { Context } from "../../../index";
import DropDownMenu from "../../DropDownMenu/DropDownMenu";
import { infoText } from "../../../utils/infoText";
import { observer } from "mobx-react-lite";

function DropDownSet() {
    const { store } = useContext(Context);
    return (
        <>
            <DropDownMenu
                list={["adam", "sgd"]}
                onChoose={(value) => {
                    type T = "adam" | "sgd";
                    value = value.toLocaleLowerCase();

                    store.setTrainingOptions({ optimizer: value as T });
                }}
                propName={"optimizer"}
                title="Оптимизатор"
                helpText={infoText.optimizer}
            />
            <DropDownMenu
                list={["0%", "10%", "15%", "20%"]}
                onChoose={(value) => {
                    let num = parseInt(value);
                    num /= 100;

                    store.setTrainingOptions({ validationSplit: num });
                }}
                propName={`validationSplit`}
                title="Валидация"
                helpText={infoText.validationSplit}
            />

            <DropDownMenu
                list={["16", "32", "64", "128", "256", "512"]}
                onChoose={(value) => {
                    let num = parseInt(value);

                    store.setTrainingOptions({ batchSize: num });
                }}
                propName={"batchSize"}
                title="Размер пакета"
                helpText={infoText.batchSize}
            />
        </>
    );
}

export default observer(DropDownSet);
