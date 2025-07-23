import { useEffect } from "react";
import { useLatest } from "./useLatest";

const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn);

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
};

export { useUnmount };
