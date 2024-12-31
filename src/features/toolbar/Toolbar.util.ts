import {
  run,
  stop,
  specStep,
  specStepOut,
  specStepOver,
  specStepBack,
  specStepBackOver,
  jsStep,
  jsStepOut,
  jsStepOver,
  specContinue,
  DebuggerAction,
} from "@/store/reducers/Debugger";
import { Dispatch } from "@/store";

const map: Map<string, () => DebuggerAction> = new Map(
  Object.entries({
    r: run,
    q: stop,
    s: specStep,
    o: specStepOver,
    u: specStepOut,
    b: specStepBack,
    k: specStepBackOver,
    j: jsStep,
    v: jsStepOver,
    t: jsStepOut,
    c: specContinue,
  }),
);

export const handleKeyPressBuilder = (dispatch: Dispatch) =>
  function keyPressHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement;

    if (
      focusedElement &&
      (focusedElement.tagName === "INPUT" ||
        focusedElement.tagName === "TEXTAREA")
    ) {
      return;
    }

    const action = map.get(event.key);

    if (action) {
      dispatch(action());
      return;
    } else {
      console.log(`other: ${event.key}`);
    }
  };
