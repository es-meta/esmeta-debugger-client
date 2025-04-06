const meta = ["meta/iter", "meta/debugString", "meta/version"] as const;

const state = ["state/heap", "state/context", "state/callStack"] as const;

const spec = ["spec/func", "spec/version", "spec/irToSpecNameMap"] as const;

const breakpoint = ["breakpoint"] as const;

const exec = [
  "exec/run",
  "exec/resumeFromIter",
  "exec/backToProvenance",
  "exec/specStep",
  "exec/specStepOver",
  "exec/specStepOut",
  "exec/specStepBack",
  "exec/specStepBackOut",
  "exec/specStepBackOver",
  "exec/specContinue",
  "exec/specRewind",
  "exec/irStep",
  "exec/irStepOver",
  "exec/irStepOut",
  "exec/esAstStep",
  "exec/esStatementStep",
  "exec/esStepOver",
  "exec/esStepOut",
  "exec/iterPlus",
  "exec/iterMinus",
] as const;

export const routes = [
  ...state,
  ...spec,
  ...breakpoint,
  ...exec,
  ...meta,
] as const;

export type Route = (typeof routes)[number] | `state/context/${number}`;
