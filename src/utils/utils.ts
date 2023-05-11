import store from "../store/Store";
import * as tf from "@tensorflow/tfjs";

export function removeItemAtIndex(array: any[], index: number) {
    let result = [
        ...array.slice(0, index),
        ...array.slice(index + 1, array.length),
    ];

    return result;
}

export function removeImageByIndexAtStore(
    cardIndex: number,
    imageIndex: number
) {
    let nonReversedIndex = store.base64Array[cardIndex].length - 1 - imageIndex;

    // массив который приходит в этот метод перевернут
    const resultArray = removeItemAtIndex(
        store.base64Array[cardIndex],
        nonReversedIndex
    );

    store.setBase64ForLabel(cardIndex, resultArray);

    const indexArray: number[] = [];

    for (let i = 0; i < store.trainingDataOutputs.length; i++) {
        let cur = store.trainingDataOutputs[i];

        // если аутпут равен кардИндексу (порядковому номеру карточки)
        // то пушим этот индекс в массив
        // так как этот элемент будет одним из изображений класса
        if (cur === cardIndex) {
            indexArray.push(i);
        }
    }
    // теперь в indexArray лежат индексы изображений
    // находим индекс изображения которое нужно удалить
    // так как оригинальный массив не реверснут
    // то это изображение будет по реверс индексу
    const spliceIndex = indexArray[nonReversedIndex];

    // сохраняем ссылку на тензор
    const removedInput = store.trainingDataInputs[spliceIndex];

    // удаляем из массива обучающих данных
    store.setTrainingDataInputs(
        removeItemAtIndex(store.trainingDataInputs, spliceIndex)
    );
    store.setTrainingDataOutputs(
        removeItemAtIndex(store.trainingDataOutputs, spliceIndex)
    );

    // избавляемся от ненужного тензора
    removedInput.dispose();

    // console.log(tf.memory().numTensors);

    if (store.base64Array[cardIndex].length === 0) {
        store.checkAllDataGathered();
    }
}

export function calculateNewTrainingData(index: number) {
    let newIn: tf.Tensor1D[] = [];
    let newOut: number[] = [];

    for (let i = 0; i < store.trainingDataInputs.length; i++) {
        const input = store.trainingDataInputs[i];
        const output = store.trainingDataOutputs[i];

        // аутпуту присваивалось значение индекса карточки
        if (output === index) {
            // очищаем память от ненужных тензоров
            input?.dispose?.();
        } else {
            newIn.push(input);
            // так как мы удаляем элемент, то нужно
            // подвинуть аутпуты дальше по индексу влево.
            // Если аутпут больше чем индекс, то его нужно
            // сместить на единицу так как удалился один элемент
            newOut.push(index < output ? output - 1 : output);
        }
    }

    return {
        newIn,
        newOut,
    };
}
