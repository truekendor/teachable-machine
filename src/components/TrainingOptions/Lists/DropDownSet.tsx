import DropDownMenu from "../../DropDownMenu/DropDownMenu";
import { infoText } from "../../../utils/infoText";
import { observer } from "mobx-react-lite";
import neuralStore from "../../../store/neuralStore";

function DropDownSet() {
    return (
        <>
            <DropDownMenu
                list={["adam", "sgd"]}
                onChoose={(value) => {
                    type T = "adam" | "sgd";
                    value = value.toLocaleLowerCase();

                    neuralStore.setTrainingOptions({ optimizer: value as T });
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

                    neuralStore.setTrainingOptions({ validationSplit: num });
                }}
                propName={`validationSplit`}
                title="Валидация"
                helpText={infoText.validationSplit}
            />

            <DropDownMenu
                list={["16", "32", "64", "128", "256", "512"]}
                onChoose={(value) => {
                    let num = parseInt(value);

                    neuralStore.setTrainingOptions({ batchSize: num });
                }}
                propName={"batchSize"}
                title="Размер пакета"
                helpText={infoText.batchSize}
            />
        </>
    );
}

export default observer(DropDownSet);
