import {
  run,
  resumeFromIter,
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
} from "@/store/reducers/Debugger";
import { Dispatch } from "@/store";
import { Selected } from "./Toolbar.redux";

const map = (key: string, cond: Selected) => {
  switch (key) {
    case "r":
      return cond.disableRun ? null : run();
    case "e":
      return cond.disableRun ? null : resumeFromIter();
    case "q":
      return cond.disableQuit ? null : stop();
    case "c":
      return cond.disableGoingForward ? null : specContinue();
    case "s":
      return cond.disableGoingForward ? null : specStep();
    case "o":
      return cond.disableGoingForward ? null : specStepOver();
    case "u":
      return cond.disableGoingForward ? null : specStepOut();
    case "b":
      return cond.disableGoingBackward ? null : specStepBack();
    case "k":
      return cond.disableGoingBackward ? null : specStepBackOver();
    case "j":
      return cond.disableGoingForward ? null : jsStep();
    case "v":
      return cond.disableGoingForward ? null : jsStepOver();
    case "t":
      return cond.disableGoingForward ? null : jsStepOut();
    default:
      return null;
  }
};

export const handleKeyPressBuilder = (dispatch: Dispatch, cond: Selected) =>
  function keyPressHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement;

    if (
      focusedElement &&
      (focusedElement.tagName === "INPUT" ||
        focusedElement.tagName === "TEXTAREA")
    )
      return;

    const isComplex = (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey);

    const action = map(event.key, cond);

    if (action && !isComplex) {
      dispatch(action);
      return;
    } else {
      console.log(`other: ${event.key}`);
    }
  };
