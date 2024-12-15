export const routes = [
  "state/heap",
  "state/context",
  "state/callStack",
  "spec/func",
  "breakpoint",
  "exec/run",
  "exec/specStep",
  "exec/specStepOver",
  "exec/specStepOut",
  "exec/specContinue",
  "exec/esStep",
  "exec/esStepOver",
  "exec/esStepOut",
] as const;

export type Route = typeof routes[number] | `state/context/${number}`;