export function removeItemAtIndex(array: any[], index: number) {
    let result = [
        ...array.slice(0, index),
        ...array.slice(index + 1, array.length),
    ];

    return result;
}
