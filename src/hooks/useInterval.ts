import { useCallback, useEffect, useRef } from "react";
import { useMemoizedFn } from "./useMemoizedFn";

type UseIntervalType = (
  fn: () => void,
  delay?: number,
  options?: {
    immediate?: boolean;
  }
) => Function;

const useInterval: UseIntervalType = (fn, delay, options = {}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timerCallback = useMemoizedFn(fn);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (delay && (typeof delay === "number" || delay < 0)) return;
    if (options.immediate) {
      timerCallback();
    }
    timerRef.current = setInterval(timerCallback, delay);
    return clear;
  }, [delay, options?.immediate]);

  return clear;
};

export { useInterval };
