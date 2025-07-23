import { useEffect, useLayoutEffect } from "react";
import { createEffectWithTarget } from "./utils/createEffectWithTarget";

const useEffectWithTarget = createEffectWithTarget(useEffect);
const useEffectLayoutWithTarget = createEffectWithTarget(useLayoutEffect);

export { useEffectLayoutWithTarget, useEffectWithTarget };
