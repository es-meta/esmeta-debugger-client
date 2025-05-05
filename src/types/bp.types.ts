// type
export enum BreakpointType {
  Spec = "BreakpointType/Spec",
  Js = "BreakpointType/Js",
}
export type Breakpoint = SpecBreakpoint | JsBreakpoint;
export interface SpecBreakpoint {
  type: BreakpointType.Spec;
  duplicateCheckId: string;
  fid: number;
  name: string;
  steps: number[];
  enabled: boolean;
}
export interface JsBreakpoint {
  type: BreakpointType.Js;
  duplicateCheckId: string;
  name: string;
  line: number;
  enabled: boolean;
}
