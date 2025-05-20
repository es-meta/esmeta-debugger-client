import { AST } from "@/types/ast.types";
import { StepResult } from "./debugger.types";
// import { Heap } from "./heap.types";
import { RawEnv } from "./ir-state.types";
import { Heap } from "./heap.types";
export interface StepResultAdditional {
  result: StepResult;
  callstack: [
    number,
    number[],
    boolean,
    RawEnv,
    number[][],
    string,
    [number, number],
  ][];
  // heap: Heap,
  stepCnt: number;
  instCnt: number;
  heap: Heap;
  reprint: Maybe<string>;
  ast: Maybe<AST>;
}

const meta = ["meta/iter", "meta/debugString", "meta/version"] as const;

const spec = ["spec/func", "spec/version"] as const;

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
  "exec/stepCntPlus",
  "exec/stepCntMinus",
  "exec/instCntPlus",
  "exec/instCntMinus",
] as const;

export const routes = [
  ...spec,
  ...breakpoint,
  ...exec,
  ...meta,
] as const;

export type Route = (typeof routes)[number];
