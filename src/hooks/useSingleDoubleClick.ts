import { useEffect, useState } from "react";

type UseClickType = (
  actionSimpleClick: Function,
  actionDoubleClick: Function,
  delay: number,
  ref: React.RefObject<HTMLElement>
) => Function;

//设计一个单击和双击的并根据延迟来确定的函数
export const useSingleDoubleClick: UseClickType = (
  actionSimpleClick,
  actionDoubleClick,
  delay = 250,
  ref
) => {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) {
        actionSimpleClick();
      }
      setClick(0);
    }, delay);

    if (click === 2) {
      actionDoubleClick();
    }
    return () => clearTimeout(timer);
  }, [actionSimpleClick, actionDoubleClick, click]);

  return () => setClick((prev) => prev + 1);
};
