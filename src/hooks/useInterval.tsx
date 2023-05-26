import { useRef, useCallback } from "react";

export default function useInterval(callback: () => any, delay: number) {
    const timer = useRef<any>();
    const intervalCallback = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
        }
        timer.current = setInterval(() => {
            callback();
        }, delay);

        return () => {
            clearInterval(timer?.current);
        };
    }, [delay, callback]);

    return intervalCallback;
}
