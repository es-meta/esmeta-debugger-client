export interface StandaloneDebugger {
  meta_version: () => string;
  meta_iter: () => number;
  meta_debugString: () => string;

  state_heap: () => string;
  state_callStack: () => string;
  state_context: (num: number) => string;

  spec_func: () => string;
  spec_version: () => string;
  spec_irToSpecNameMap: () => never; // handle this in the frontend

  breakpoint_add: (body: string | undefined) => string;
  breakpoint_remove: (body: string | undefined) => string;
  breakpoint_toggle: (body: string | undefined) => string;

  exec_run: (raw: string | undefined) => string;
  exec_resumeFromIter: (raw: string | undefined) => string;
  exec_backToProvenance: (raw: string | undefined) => string;
  exec_step: (noBreak: boolean) => string;
  exec_stepOver: (noBreak: boolean) => string;
  exec_stepOut: (noBreak: boolean) => string;
  exec_stepBack: (noBreak: boolean) => string;
  exec_stepBackOver: (noBreak: boolean) => string;
  exec_stepBackOut: (noBreak: boolean) => string;

  exec_continue: () => string;
  exec_rewind: () => string;

  exec_irStep: (noBreak: boolean) => string;
  exec_irStepOver: (noBreak: boolean) => string;
  exec_irStepOut: (noBreak: boolean) => string;

  exec_esAstStep: () => string;
  exec_esStatementStep: () => string;
  exec_esStepOver: () => string;
  exec_esStepOut: () => string;

  exec_iterPlus: (noBreak: boolean) => string;
  exec_iterMinus: (noBreak: boolean) => string;
}

export interface StandaloneDebuggerInput {
  funcs: string;
  version: string;
  grammar: string;
  tables: string;
  tyModel: string;
  irToSpecNameMap: string;
}

export interface ModuleGeneratedByScalaJS {
  StandaloneDebugger: {
    buildFrom: (input: StandaloneDebuggerInput) => Promise<StandaloneDebugger>;
  };
}
