// name, beautified value
export type FlattendEnv = [string | symbol, string][];
export type RawEnv = [[string, string][], [string] | []];
// context name, current step number, env data
export type Context = {
  fid: number;
  steps: number[];
  isExit: boolean;
  env: RawEnv;
  algoDot: string;
  visited: number[][];
  jsRange: [number, number]; // start and end of the context
};
export type CallStack = Context[];
