import { useEffect, useLayoutEffect, DependencyList, useRef } from "react";
import { deepEqual } from "./utils/deepEqual";

//获取useEffect的类型，并返回useEffect的类型
type EffectHookType = typeof useEffect | typeof useLayoutEffect;

type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

export const createDeepCompareEffect: CreateUpdateEffect = (hook) => {
  //获取传入的副作用函数的回调
  const EffectHookCallBack = hook;

  return (effect, dependen) => {
    const ref = useRef<undefined | DependencyList>(undefined);
    const signalRef = useRef<number>(0);
    if (dependen === undefined || !deepEqual(dependen, ref.current)) {
      signalRef.current += 1;
    }
    ref.current = dependen;
    EffectHookCallBack(effect, [signalRef.current]);
  };
};
