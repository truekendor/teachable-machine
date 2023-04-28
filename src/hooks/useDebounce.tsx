import { useRef, useCallback } from "react";

export default function useDebounce(
    callback: () => any,
    delay: number,
    condition?: () => boolean
) {
    const timer = useRef<any>();
    const debouncedCallback = useCallback(() => {
        if (timer?.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            if (condition === undefined || condition === null) {
                callback();
            } else if (condition() === true) {
                callback();
            }
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
}
