type Props = {
    currentEpoch: number;
    numOfEpochs: number;
};

export default function ProgressBar({ currentEpoch, numOfEpochs }: Props) {
    return (
        <div
            style={
                {
                    "--epoch-completed": `${
                        (currentEpoch / numOfEpochs) * 100
                    }%`,
                } as React.CSSProperties
            }
            className="warn"
        >
            <div>Не переключайте вкладки пока модель обучается</div>
            <div>
                {currentEpoch} / {numOfEpochs}
            </div>
        </div>
    );
}
