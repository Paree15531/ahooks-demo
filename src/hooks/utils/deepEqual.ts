import { isEqual } from "lodash";

export function deepEqual(obj1: any, obj2: any) {
  //判断是否是对象
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return Object.is(obj1, obj2);
  }
  return isEqual(obj1, obj2);
}
