import { DependencyList } from "react";

function depsAreSame(oldDeps: DependencyList, dpes: DependencyList) {
  if (oldDeps === dpes) return true;

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], dpes[i])) {
      return false;
    }
  }
  return true;
}

export { depsAreSame };
