import { Selected } from "./atoms";
import { logger } from "@/utils";
import type { useDebuggerActions } from "@/hooks/use-debugger-actions";

const map = (
  key: string,
  cond: Selected,
  devMode: boolean,
  actions: ReturnType<typeof useDebuggerActions>,
) => {
  switch (key) {
    case "r":
      return cond.disableRun ? null : actions.run;
    case "e":
      return cond.disableResume ? null : actions.resume;
    case "q":
      return cond.disableQuit ? null : actions.stop;
    case "c":
      return cond.disableGoingForward ? null : actions.specContinue;
    case "s":
      return cond.disableGoingForward ? null : actions.specStep;
    case "o":
      return cond.disableGoingForward ? null : actions.specStepOver;
    case "u":
      return cond.disableGoingForward ? null : actions.specStepOut;
    case "b":
      return cond.disableGoingBackward ? null : actions.specStepBack;
    case "a":
      return cond.disableGoingBackward ? null : actions.specStepBackOver;
    case "k":
      return cond.disableGoingBackward ? null : actions.specStepBackOut;
    case "w":
      return cond.disableGoingBackward ? null : actions.specRewind;
    case "j":
      return cond.disableGoingForward ? null : actions.esStepStatement;
    case "p":
      return cond.disableGoingForward ? null : actions.esStepAst;
    case "v":
      return cond.disableGoingForward ? null : actions.esStepOver;
    case "t":
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
      (focusedElement.tagName === "INPUT" ||
        focusedElement.tagName === "TEXTAREA")
    )
      return;

    const isComplex =
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

    logger.log?.(`${event.key}`);

    const action = map(event.key, cond, devMode, actions);

    if (action && !isComplex) {
      action();
    }
  };
