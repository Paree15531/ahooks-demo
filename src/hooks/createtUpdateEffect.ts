import { useEffect, useLayoutEffect, useRef } from "react";

//获取函数类型
type EffectHookType = typeof useEffect | typeof useLayoutEffect;

type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

//创建一个只在组件更新时执行的effect，在组件初始化时不会执行
export const createUpdateEffect: CreateUpdateEffect = (hook) => {
  const EffectHookCallBack = hook;
  return (effect, deps) => {
    const isMounted = useRef(false);

    EffectHookCallBack(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    EffectHookCallBack(() => {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        return effect();
      }
    }, [deps]);
  };
};
