import { AppDispatch } from "@/store";
import { Selected } from "./Toolbar.atom";
import { logger } from "@/utils";
import {
  continueAction,
  jsStepAstAction,
  jsStepOutAction,
  jsStepOverAction,
  jsStepStatemmentAction,
  resumeFromIterAction,
  rewindAction,
  runAction,
  specStepAction,
  specStepBackAction,
  specStepBackOutAction,
  specStepBackOverAction,
  specStepOutAction,
  specStepOverAction,
  stopAction,
} from "@/actions";

const map = (key: string, cond: Selected, devMode: boolean) => {
  switch (key) {
    case "r":
      return cond.disableRun ? null : runAction();
    case "e":
      return cond.disableRun ? null : resumeFromIterAction();
    case "q":
      return cond.disableQuit ? null : stopAction();
    case "c":
      return cond.disableGoingForward ? null : continueAction();
    case "s":
      return cond.disableGoingForward ? null : specStepAction();
    case "o":
      return cond.disableGoingForward ? null : specStepOverAction();
    case "u":
      return cond.disableGoingForward ? null : specStepOutAction();
    case "b":
      return cond.disableGoingBackward ? null : specStepBackAction();
    case "a":
      return cond.disableGoingBackward ? null : specStepBackOverAction();
    case "k":
      return cond.disableGoingBackward ? null : specStepBackOutAction();
    case "w":
      return cond.disableGoingBackward ? null : rewindAction();
    case "j":
      return cond.disableGoingForward ? null : jsStepStatemmentAction();
    case "p":
      return cond.disableGoingForward || !devMode ? null : jsStepAstAction();
    case "v":
      return cond.disableGoingForward ? null : jsStepOverAction();
    case "t":
      return cond.disableGoingForward ? null : jsStepOutAction();
    default:
      return null;
  }
};

export const handleKeyPressBuilder = (
  dispatch: AppDispatch,
  cond: Selected,
  devMode: boolean,
) =>
  function keyPressHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement;

    if (
      focusedElement &&
      (focusedElement.tagName === "INPUT" ||
        focusedElement.tagName === "TEXTAREA")
    )
      return;

    const isComplex =
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

    const action = map(event.key, cond, devMode);

    if (action && !isComplex) {
      dispatch(action);
      return;
    } else {
      logger.log?.(`other: ${event.key}`);
    }
  };
