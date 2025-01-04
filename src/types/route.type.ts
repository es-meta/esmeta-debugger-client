export const routes = [
  "state/heap",
  "state/context",
  "state/callStack",
  // TODO stats
  "state/iterCount",
  "spec/func",
  "spec/version",
  "breakpoint",
  "exec/run",
  "exec/resumeFromIter",
  "exec/ignoreFlag",
  "exec/specStep",
  "exec/specStepOver",
  "exec/specStepOut",
  "exec/specStepBack",
  "exec/specStepBackOut",
  "exec/specStepBackOver",
  "exec/specContinue",
  "exec/specRewind",
  "exec/esStep",
  "exec/esStepOver",
  "exec/esStepOut",
] as const;

export type Route = (typeof routes)[number] | `state/context/${number}`;
