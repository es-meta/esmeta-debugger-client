// import produce from "immer";

// redux actions
export enum DebuggerActionType {
  RUN = "DebuggerAction/RUN",
  RESUME_FROM_ITER = "DebuggerAction/RESUME_FROM_ITER",
  BACK_TO_PROVENANCE = "DebuggerAction/BACK_TO_PROVENANCE",
  STOP = "DebuggerAction/STOP",
  SPEC_STEP = "DebuggerAction/STEP",
  SPEC_STEP_OUT = "DebuggerAction/STEP_OUT",
  SPEC_STEP_OVER = "DebuggerAction/STEP_OVER",
  SPEC_STEP_BACK = "DebuggerAction/STEP_BACK",
  SPEC_STEP_BACK_OVER = "DebuggerAction/STEP_BACK_OVER",
  SPEC_STEP_BACK_OUT = "DebuggerAction/STEP_BACK_OUT",
  ITER_PLUS = "DebuggerAction/ITER_PLUS",
  ITER_MINUS = "DebuggerAction/ITER_MINUS",
  IR_STEP = "DebuggerAction/IR_STEP",
  IR_STEP_OVER = "DebuggerAction/IR_STEP_OVER",
  IR_STEP_OUT = "DebuggerAction/IR_STEP_OUT",
  JS_STEP_AST = "DebuggerAction/JS_STEP_AST",
  JS_STEP_STATEMENT = "DebuggerAction/JS_STEP_STATEMENT",
  JS_STEP_OUT = "DebuggerAction/JS_STEP_OUT",
  JS_STEP_OVER = "DebuggerAction/JS_STEP_OVER",
  SPEC_CONTINUE = "DebuggerAction/SPEC_CONTINUE",
  SPEC_REWIND = "DebuggerAction/SPEC_REWIND",
}
export const run = (): DebuggerAction => ({
  type: DebuggerActionType.RUN,
});
export const resumeFromIter = (): DebuggerAction => ({
  type: DebuggerActionType.RESUME_FROM_ITER,
});
export const backToProvenance = (address: string): DebuggerAction => ({
  type: DebuggerActionType.BACK_TO_PROVENANCE,
  address,
});
export const stop = (): DebuggerAction => ({
  type: DebuggerActionType.STOP,
});
export const specStep = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_STEP,
});
export const specStepOver = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_STEP_OVER,
});
export const specStepOut = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_STEP_OUT,
});
export const specStepBack = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_STEP_BACK,
});
export const specStepBackOver = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_STEP_BACK_OVER,
});
export const specStepBackOut = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_STEP_BACK_OUT,
});
export const iterPlus = (): DebuggerAction => ({
  type: DebuggerActionType.ITER_PLUS,
});
export const iterMinus = (): DebuggerAction => ({
  type: DebuggerActionType.ITER_MINUS,
});
export const irStep = (): DebuggerAction => ({
  type: DebuggerActionType.IR_STEP,
});
export const irStepOver = (): DebuggerAction => ({
  type: DebuggerActionType.IR_STEP_OVER,
});
export const irStepOut = (): DebuggerAction => ({
  type: DebuggerActionType.IR_STEP_OUT,
});
export const jsStepAst = (): DebuggerAction => ({
  type: DebuggerActionType.JS_STEP_AST,
});
export const jsStepStatement = (): DebuggerAction => ({
  type: DebuggerActionType.JS_STEP_STATEMENT,
});
export const jsStepOver = (): DebuggerAction => ({
  type: DebuggerActionType.JS_STEP_OVER,
});
export const jsStepOut = (): DebuggerAction => ({
  type: DebuggerActionType.JS_STEP_OUT,
});
export const specContinue = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_CONTINUE,
});
export const specRewind = (): DebuggerAction => ({
  type: DebuggerActionType.SPEC_REWIND,
});
export type DebuggerAction =
  | {
      type: DebuggerActionType.RUN;
    }
  | {
      type: DebuggerActionType.RESUME_FROM_ITER;
    }
  | {
      type: DebuggerActionType.BACK_TO_PROVENANCE;
      address: string;
    }
  | {
      type: DebuggerActionType.STOP;
    }
  | {
      type: DebuggerActionType.SPEC_STEP;
    }
  | {
      type: DebuggerActionType.SPEC_STEP_OVER;
    }
  | {
      type: DebuggerActionType.SPEC_STEP_OUT;
    }
  | {
      type: DebuggerActionType.SPEC_STEP_BACK;
    }
  | {
      type: DebuggerActionType.SPEC_STEP_BACK_OVER;
    }
  | {
      type: DebuggerActionType.SPEC_STEP_BACK_OUT;
    }
  | {
      type: DebuggerActionType.ITER_PLUS;
    }
  | {
      type: DebuggerActionType.ITER_MINUS;
    }
  | {
      type: DebuggerActionType.IR_STEP;
    }
  | {
      type: DebuggerActionType.IR_STEP_OVER;
    }
  | {
      type: DebuggerActionType.IR_STEP_OUT;
    }
  | {
      type: DebuggerActionType.JS_STEP_AST;
    }
  | {
      type: DebuggerActionType.JS_STEP_STATEMENT;
    }
  | {
      type: DebuggerActionType.JS_STEP_OVER;
    }
  | {
      type: DebuggerActionType.JS_STEP_OUT;
    }
  | {
      type: DebuggerActionType.SPEC_CONTINUE;
    }
  | {
      type: DebuggerActionType.SPEC_REWIND;
    };

// redux state
type DebuggerState = Record<string, never>;
const initialState: DebuggerState = {};

// reducer
export default function reducer(state = initialState) {
  return state;
}
