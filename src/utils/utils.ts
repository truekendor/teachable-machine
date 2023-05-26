import * as tf from "@tensorflow/tfjs";

interface NewTrainingData {
    trainingDataInputs: tf.Tensor1D[];
    trainingDataOutputs: number[];
    index: number;
}

export function removeItemAtIndex<T>(array: T[], index: number) {
    let result = [
        ...array.slice(0, index),
        ...array.slice(index + 1, array.length),
    ];

    return result;
}

export function calculateNewTrainingData({
    trainingDataInputs,
    trainingDataOutputs,
    index,
}: NewTrainingData) {
    let newIn: tf.Tensor1D[] = [];
    let newOut: number[] = [];

    for (let i = 0; i < trainingDataInputs.length; i++) {
        const input = trainingDataInputs[i];
        const output = trainingDataOutputs[i];

        // the output was assigned the index value of the card
        if (output === index) {
            // clearing the memory of unnecessary tensors
            input?.dispose?.();
        } else {
            newIn.push(input);
            // since we are deleting an element, we need
            // move the outputs further along the index to the left.
            // If the output is larger than the index, then it needs
            // offset by one since one element was deleted
            newOut.push(index < output ? output - 1 : output);
        }
    }

    return { newIn, newOut };
}

class DebugTfMemory {
    private timerId: any;

    public debugMemory() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.timerId = setInterval(() => {
            let numTensors = tf.memory().numTensors.toString();
            let kbMemory = Math.floor(tf.memory().numBytes / 1000).toString();

            let { str1, str2 } = this.stringNormal(numTensors, kbMemory);

            console.log(
                `%c${str1} - num tensors \n${str2} - num kb`,
                "font-family: monospace;"
            );
        }, 1000);
    }

    private stringNormal(str1: string, str2: string) {
        const diff = str2.length - str1.length;
        if (diff >= 0) {
            str1 = str1.concat("", " ".repeat(diff));
        } else {
            str2 = str2.concat("", " ".repeat(Math.abs(diff)));
        }

        return { str1, str2 };
    }
}

export const debugTfMemory = new DebugTfMemory();
