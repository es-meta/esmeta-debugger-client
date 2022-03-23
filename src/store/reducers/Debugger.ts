// import produce from "immer";

// redux actions
export enum DebuggerActionType {
  RUN = "DebuggerAction/RUN",
  STOP = "DebuggerAction/STOP",
  SPEC_STEP = "DebuggerAction/STEP",
  SPEC_STEP_OUT = "DebuggerAction/STEP_OUT",
  SPEC_STEP_OVER = "DebuggerAction/STEP_OVER",
  JS_STEP = "DebuggerAction/JS_STEP",
  JS_STEP_OUT = "DebuggerAction/JS_STEP_OUT",
  JS_STEP_OVER = "DebuggerAction/JS_STEP_OVER",
  SPEC_CONTINUE = "DebuggerAction/SPEC_CONTINUE",
}
export const run = (): DebuggerAction => ({
  type: DebuggerActionType.RUN,
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
export const jsStep = (): DebuggerAction => ({
  type: DebuggerActionType.JS_STEP,
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
export type DebuggerAction =
  | {
      type: DebuggerActionType.RUN;
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
      type: DebuggerActionType.JS_STEP;
    }
  | {
      type: DebuggerActionType.JS_STEP_OVER;
    }
  | {
      type: DebuggerActionType.JS_STEP_OUT;
    }
  | {
      type: DebuggerActionType.SPEC_CONTINUE;
    };

// redux state
type DebuggerState = Record<string, never>;
const initialState: DebuggerState = {};

// reducer
export default function reducer(state = initialState) {
  return state;
}
