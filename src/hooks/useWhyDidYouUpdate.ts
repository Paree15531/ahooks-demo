import { useEffect, useRef } from "react";

type WhyDidYouUpdateType = (
  componentName: string,
  props: Record<string, any>
) => void;

type IProps = Record<string, any>;

//检测哪些props被修改了
const useWhyDidYouUpdate: WhyDidYouUpdateType = (componentName, props) => {
  const prevProps = useRef<IProps>({});
  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changesProps: IProps = {};

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.current[key], props[key])) {
          changesProps[key] = {
            form: prevProps.current[key],
            to: props[key],
          };
        }
      });
      if (Object.keys(changesProps).length) {
        console.log("[why-did-you-update]", componentName, changesProps);
      }
    }
    prevProps.current = props;
  });
};

export { useWhyDidYouUpdate };
