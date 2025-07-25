import { useRef, useMemo } from "react";

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (...args: Parameters<T>) => ReturnType<T>;

const useMemoizedFn = <T extends noop>(fn: T) => {
  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo<T>(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>(undefined);

  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
};

export { useMemoizedFn };
