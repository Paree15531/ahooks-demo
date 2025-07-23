import { useEffectWithTarget } from "./useEffectWithTarget";
import { useLatest } from "./useLatest";
import { BasicTarget, getTargetElement } from "./utils/domTarget";

type noop = (...args: any[]) => void;

type Target = BasicTarget<HTMLElement | Element | Document | Window>;

type Options<T extends Target = Target> = {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  enable?: boolean;
  target?: T;
};

//判断是否时HTMLElementEventMap事件的
function useEventListener<K extends keyof HTMLElementEventMap>(
  evenetName: K,
  handler: (ev: HTMLBodyElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void;

//匹配是否时元素的事件
function useEventListener<K extends keyof ElementEventMap>(
  evenetName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void;

function useEventListener<K extends keyof DocumentEventMap>(
  evenetName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void;

function useEventListener<K extends keyof WindowEventMap>(
  evenetName: K,
  handler: (ev: Event) => void,
  options?: Options<Window>
): void;

function useEventListener(
  evenetName: string | Array<string>,
  handler: noop,
  options: Options
): void;

function useEventListener(
  eventName: string | Array<string>,
  handler: noop,
  options: Options = {}
) {
  const handlerRef = useLatest<noop>(handler);

  useEffectWithTarget(
    () => {
      const { enable = true } = options;

      if (!enable) return;

      //获取目标元素
      const targetElement = getTargetElement(options.target, window);
      //判断目标元素上是否存在事件监听函数
      if (!targetElement?.addEventListener) {
        return;
      }

      const eventListener = (event: Event) => {
        return handlerRef.current(event);
      };

      const eventNameArray = Array.isArray(eventName) ? eventName : [eventName];

      if (eventNameArray.length <= 0) {
        return;
      }

      eventNameArray.forEach((evenetName) => {
        targetElement.addEventListener(evenetName, eventListener, {
          capture: options.capture,
          once: options.once,
          passive: options.passive,
        });
      });

      return () => {
        if (eventNameArray.length > 0) {
          eventNameArray.forEach((eventName) => {
            targetElement.removeEventListener(eventName, eventListener, {
              capture: options.capture,
            });
          });
        }
      };
    },
    [eventName, options.capture, options.once, options.passive, options.enable],
    options.target
  );
}

export { useEventListener };
