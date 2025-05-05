import type { Algorithm } from "@/types/spec.types";

// name, beautified value
export type Environment = [string, string][];
// context name, current step number, env data
export type Context = {
  fid: number;
  name: string;
  steps: number[];
  isExit: boolean;
  env: Environment;
  algo: Algorithm;
  visited: number[][];
  jsRange: [number, number]; // start and end of the context
};
export type CallStack = Context[];
