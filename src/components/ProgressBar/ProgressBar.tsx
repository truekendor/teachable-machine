import { observer } from "mobx-react-lite";

import neuralStore from "../../store/neuralStore";

function ProgressBar() {
    return (
        <div
            style={
                {
                    "--epoch-completed": `${
                        (neuralStore.currentEpoch /
                            neuralStore.trainingOptions.epochs) *
                        100
                    }%`,
                } as React.CSSProperties
            }
            className="warn"
        >
            <div>Не переключайте вкладки пока модель обучается</div>
            <div>
                {neuralStore.currentEpoch} /{" "}
                {neuralStore.trainingOptions.epochs}
            </div>
        </div>
    );
}

export default observer(ProgressBar);
