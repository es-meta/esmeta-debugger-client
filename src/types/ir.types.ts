import { Parameter, SpecFuncInfo } from "./spec.types";

export interface IrFunc {
  fid: number;
  name: string;
  nameForContext: string;
  nameForCallstack: string;
  kind: number;
  params: Parameter[];
  algoCode: string;
  info: SpecFuncInfo | undefined;
}
