export interface ScalaJSDebuggerService {
  spec_func: () => string;
  state_heap: () => string;
  state_callStack: () => string;
  state_context: (num: number) => string;
  spec_version: () => string;
  exec_step: () => string;
  exec_stepOver: () => string;
  exec_stepOut: () => string;
  // exec_run: (body: string) => string;
  exec_continue: () => string;
  exec_stepBack: () => string;
  exec_stepBackOver: () => string;
  exec_stepBackOut: () => string;
  exec_esStep: () => string;
  exec_esStepOver: () => string;
  exec_esStepOut: () => string;
  breakpoint_add: (body: string | undefined) => string;
  breakpoint_remove: (body: string | undefined) => string;
  breakpoint_toggle: (body: string | undefined) => string;
  exec_run: (body: string | undefined) => string;
}

export interface ScalaJSFactoryInput {
  funcs: string;
  version: string;
  grammar: string;
  tables: string;
  tyModel: string;
  irFuncToCode: string;
}
