export interface StandaloneDebugger {
  meta_version: () => string;
  meta_iter: () => number;
  meta_debugString: () => string;
  spec_func: () => string;
  state_heap: () => string;
  state_callStack: () => string;
  state_context: (num: number) => string;
  spec_version: () => string;
  exec_step: (noBreak: boolean) => string;
  exec_stepOver: (noBreak: boolean) => string;
  exec_stepOut: (noBreak: boolean) => string;
  exec_continue: (noBreak: boolean) => string;
  exec_stepBack: (noBreak: boolean) => string;
  exec_stepBackOver: (noBreak: boolean) => string;
  exec_stepBackOut: (noBreak: boolean) => string;
  exec_esStep: (noBreak: boolean) => string;
  exec_esStepOver: (noBreak: boolean) => string;
  exec_esStepOut: (noBreak: boolean) => string;
  iter_plus: (noBreak: boolean) => string;
  iter_minus: (noBreak: boolean) => string;
  breakpoint_add: (body: string | undefined) => string;
  breakpoint_remove: (body: string | undefined) => string;
  breakpoint_toggle: (body: string | undefined) => string;
  exec_run: (body: string | undefined) => string;
}

export interface StandaloneDebuggerInput {
  funcs: string;
  version: string;
  grammar: string;
  tables: string;
  tyModel: string;
  irFuncToCode: string;
  irToSpecNameMap: string;
}

export interface ModuleGeneratedByScalaJS {
  StandaloneDebugger: {
    buildFrom: (input: StandaloneDebuggerInput) => Promise<StandaloneDebugger>;
  };
}
