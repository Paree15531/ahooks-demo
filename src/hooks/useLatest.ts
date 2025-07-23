import { useRef } from "react";

type UseLatestType = <T>(value: T) => { readonly current: T };

export const useLatest: UseLatestType = (value) => {
  const ref = useRef(value);
  if (!ref.current) {
    ref.current = value;
  }
  return ref;
};
