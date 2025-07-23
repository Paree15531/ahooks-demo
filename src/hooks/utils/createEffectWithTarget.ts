import {
  useEffect,
  useLayoutEffect,
  EffectCallback,
  DependencyList,
  useRef,
} from "react";
import { BasicTarget, getTargetElement } from "./domTarget";
import { depsAreSame } from "./depsAreSame";

type useEffectType = typeof useEffect | typeof useLayoutEffect;

const createEffectWithTarget = (useEffectCallback: useEffectType) => {
  const useEffectWithTaget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | Array<BasicTarget<any>>
  ) => {
    const hasInitRef = useRef<boolean>(false);

    const lastElementRef = useRef<Array<Element | null>>([]);
    const lastDepsRef = useRef<DependencyList>([]);

    const unLoadRef = useRef<ReturnType<EffectCallback>>(undefined);

    useEffectCallback(() => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets.map((target) => getTargetElement(target));

      //init run
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;

        //保存这次的副作用清理函数
        unLoadRef.current = effect();
        return;
      }

      if (
        lastDepsRef.current.length !== els.length ||
        !depsAreSame(lastDepsRef.current, deps) ||
        !depsAreSame(lastElementRef.current, els)
      ) {
        //如果依赖项存在变化，就执行上一次的清理函数
        unLoadRef.current?.();

        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });
    //组件卸载时的调用函数
    return () => {
      unLoadRef.current?.();
      hasInitRef.current = false;
    };
  };

  return useEffectWithTaget;
};

export { createEffectWithTarget };
