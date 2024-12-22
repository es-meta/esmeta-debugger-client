import { useCallback, useEffect } from "react";
import {
  ArrowDownToDotIcon,
  ArrowUpFromDotIcon,
  PlayIcon,
  RedoDotIcon,
  SquareIcon,
  StepForwardIcon,
  UndoDotIcon,
  UndoIcon,
} from "lucide-react";

import ActionButton from "../../components/button/ActionButton";
import CollapsableButtonGroup from "../../components/button/CollapsableButtonGroup";
import Settings from "../modal/Settings";
import LayoutSettings from "../modal/LayoutSettings";

import { connector, type ToolbarProps } from "./Toolbar.redux";

export default connector(function Toolbar(props: ToolbarProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    /*
      prevent handleKeyPress called while adding breakpoints
     */
    const focusedElement = document.activeElement;
    if (
      focusedElement &&
      (focusedElement.tagName === "INPUT" ||
        focusedElement.tagName === "TEXTAREA")
    ) {
      return;
    }

    switch (event.key) {
      case "r":
        run();
        break;
      case "q":
        stop();
        break;
      case "s":
        specStep();
        break;
      case "o":
        specStepOver();
        break;
      case "u":
        specStepOut();
        break;
      case "b":
        alert("not implemented");
        break;
      case "j":
        jsStep();
        break;
      case "v":
        jsStepOver();
        break;
      case "t":
        jsStepOut();
        break;
      case "c":
        specContinue();
        break;
      case "Escape":
        break;
      default:
        console.log(`other: ${event.key}`);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const {
    specContinue,
    disableRun,
    disableDebuggerBtn,
    disableContinue,
    run,
    stop,
    specStep,
    specStepOver,
    specStepOut,
    jsStep,
    jsStepOver,
    jsStepOut,
  } = props;

  const emphasize = "text-es";

  return (
    <aside className="sticky top-0 w-full backdrop-blur-sm z-[2]">
      <div className="bg-neutral-100 size-full flex-row bg-opacity-75 flex items-center min-h-full space-x-0 flex-wrap p-2 gap-y-2 gap-x-1 justify-start z-[1001]">
        <CollapsableButtonGroup>
          <ActionButton
            position="left"
            disabled={disableRun}
            onClick={() => run()}
          >
            <PlayIcon />
            <span>
              <span className={emphasize}>R</span>
              <span>un</span>
            </span>
          </ActionButton>

          <ActionButton
            position="center"
            disabled={disableDebuggerBtn}
            onClick={() => specContinue()}
          >
            <StepForwardIcon />
            <span>
              <span className={emphasize}>C</span>
              ontinue
            </span>
          </ActionButton>

          <ActionButton
            position="right"
            disabled={disableContinue}
            onClick={() => stop()}
          >
            <SquareIcon />
            <span>
              <span className={emphasize}>Q</span>
              <span>uit</span>
            </span>
          </ActionButton>
        </CollapsableButtonGroup>

        <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">
          &nbsp;
        </div>

        <CollapsableButtonGroup>
          <ActionButton
            position="left"
            disabled={disableDebuggerBtn}
            onClick={() => specStep()}
          >
            <ArrowDownToDotIcon />
            <span>
              <span className={emphasize}>S</span>
              <span>tep</span>
            </span>
          </ActionButton>
          <ActionButton
            position="center"
            disabled={disableDebuggerBtn}
            onClick={() => specStepOver()}
          >
            <RedoDotIcon />
            <span>
              Step&nbsp;
              <span className={emphasize}>O</span>
              ver
            </span>
          </ActionButton>
          <ActionButton
            position="center"
            disabled={disableDebuggerBtn}
            onClick={() => specStepOut()}
          >
            <ArrowUpFromDotIcon />
            <span>
              Step&nbsp;O
              <span className={emphasize}>u</span>t
            </span>
          </ActionButton>

          <ActionButton
            position="center"
            disabled={disableDebuggerBtn}
            onClick={() => alert("not implemented")}
          >
            <UndoIcon />
            <span>
              Step&nbsp;
              <span className={emphasize}>B</span>
              ack
            </span>
          </ActionButton>

          <ActionButton
            position="right"
            disabled={disableDebuggerBtn}
            onClick={() => alert("not implemented")}
          >
            <UndoDotIcon />
            <span>
              Step&nbsp;Over&nbsp;Bac
              <span className={emphasize}>k</span>
            </span>
          </ActionButton>
        </CollapsableButtonGroup>

        <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">
          &nbsp;
        </div>

        <CollapsableButtonGroup>
          <ActionButton
            position="left"
            disabled={disableDebuggerBtn}
            onClick={() => jsStep()}
          >
            <ArrowDownToDotIcon />
            <span>
              <span className={emphasize}>J</span>S Step
            </span>
          </ActionButton>
          <ActionButton
            position="center"
            disabled={disableDebuggerBtn}
            onClick={() => jsStepOver()}
          >
            <RedoDotIcon />
            <span>
              JS Step O<span className={emphasize}>v</span>
              er
            </span>
          </ActionButton>

          <ActionButton
            position="right"
            disabled={disableDebuggerBtn}
            onClick={() => jsStepOut()}
          >
            <ArrowUpFromDotIcon />
            <span>
              JS Step Ou
              <span className={emphasize}>t</span>
            </span>
          </ActionButton>
        </CollapsableButtonGroup>

        <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">
          &nbsp;
        </div>

        <LayoutSettings />

        <Settings />
      </div>
    </aside>
  );
});
