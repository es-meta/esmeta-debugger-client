// util
export function isSameStep(steps1: number[], steps2: number[]) {
  return (
    // check reference equality
    steps1 === steps2 ||
    (steps1.length === steps2.length &&
      steps1.every((s, idx) => s === steps2[idx]))
  );
}
