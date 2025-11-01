import { Selected } from "./atoms";
import { logger } from "@/utils";
import type { useDebuggerActions } from "@/hooks/use-debugger-actions";

const map = (
  code: string,
  cond: Selected,
  devMode: boolean,
  actions: ReturnType<typeof useDebuggerActions>,
) => {
  switch (code) {
    case "KeyR":
      return cond.disableRun ? null : actions.run;
    case "KeyE":
      return cond.disableResume ? null : actions.resume;
    case "KeyQ":
      return cond.disableQuit ? null : actions.stop;
    case "KeyC":
      return cond.disableGoingForward ? null : actions.specContinue;
    case "KeyS":
      return cond.disableGoingForward ? null : actions.specStep;
    case "KeyO":
      return cond.disableGoingForward ? null : actions.specStepOver;
    case "KeyU":
      return cond.disableGoingForward ? null : actions.specStepOut;
    case "KeyB":
      return cond.disableGoingBackward ? null : actions.specStepBack;
    case "KeyA":
      return cond.disableGoingBackward ? null : actions.specStepBackOver;
    case "KeyK":
      return cond.disableGoingBackward ? null : actions.specStepBackOut;
    case "KeyW":
      return cond.disableGoingBackward ? null : actions.specRewind;
    case "KeyJ":
      return cond.disableGoingForward ? null : actions.esStepStatement;
    case "KeyP":
      return cond.disableGoingForward ? null : actions.esStepAst;
    case "KeyV":
      return cond.disableGoingForward ? null : actions.esStepOver;
    case "KeyT":
      return cond.disableGoingForward ? null : actions.esStepOut;
    default:
      return null;
  }
};

export const handleKeyPressBuilder = (
  actions: ReturnType<typeof useDebuggerActions>,
  cond: Selected,
  devMode: boolean,
) =>
  function keyPressHandler(event: KeyboardEvent) {
    const focusedElement = event.target;

    if (
      focusedElement instanceof HTMLElement &&
      (focusedElement.tagName.toUpperCase() !== "BODY")
    ) return;

    const isComplex =
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

    logger.log?.(`${event.key}`);

    const action = map(event.code, cond, devMode, actions);

    if (action && !isComplex) {
      action();
    }
  };
