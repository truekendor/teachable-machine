import { useState } from "react";

export default {};
// export default function useArray<T>(defaultValue: T) {
//     const [array, setArray] = useState(defaultValue);

//     function update(index: number, newElement: T) {
//         setArray((a: any) => [
//             ...a.slice(0, index),
//             newElement,
//             ...a.slice(index + 1, a.length - 1),
//         ]);
//     }

//     function remove(index: number) {
//         setArray((a) => [
//             ...a.slice(0, index),
//             ...a.slice(index + 1, a.length - 1),
//         ]);
//     }

//     function clear() {
//         setArray([]);
//     }

//     function push(element: any) {
//         setArray((a) => [...a, element]);
//     }

//     function set(a: T) {
//         setArray([...a] as T);
//     }

//     return { array, remove, clear, push, update, set };
// }
