import { useCallback, useEffect } from "react";
import {
  ArrowDownToDotIcon,
  ArrowUpFromDotIcon,
  PlayIcon,
  RedoDotIcon,
  SquareIcon,
  StepForwardIcon,
  StepBackIcon,
  UndoDotIcon,
  UndoIcon,
  FastForwardIcon,
  BugPlayIcon,
} from "lucide-react";
import {
  run,
  stop,
  specStep,
  specStepOut,
  specStepOver,
  specStepBack,
  specStepBackOver,
  jsStepStatement,
  jsStepOut,
  jsStepOver,
  specContinue,
  DebuggerAction,
  resumeFromIter,
  specStepBackOut,
  specRewind,
  iterPlus,
  iterMinus,
} from "@/store/reducers/Debugger";

import ToolbarButton from "@/features/toolbar/ToolbarButton";
import ToolbarButtonGroup from "@/features/toolbar/ToolbarButtonGroup";

export default function Toolbar() {
  const dispatch = useDispatch<Dispatch<DebuggerAction>>();
  const {
    disableRun,
    disableResume,
    disableQuit,
    disableGoingBackward,
    disableGoingForward,
    ignoreBP,
  } = useSelector(selector, shallowEqual);

  const handleKeyPress = useCallback(
    handleKeyPressBuilder(dispatch, {
      disableRun,
      disableResume,
      disableQuit,
      disableGoingBackward,
      disableGoingForward,
      ignoreBP,
    }),
    [
      dispatch,
      disableRun,
      disableResume,
      disableQuit,
      disableGoingBackward,
      disableGoingForward,
      ignoreBP,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const showResume = GIVEN_SETTINGS.origin.type === "visualizer";

  return (
    <aside className="relative w-full backdrop-blur-sm z-[2]">
      <div className="bg-neutral-100 dark:bg-neutral-900 size-full flex-row bg-opacity-75 flex items-center min-h-full space-x-0 flex-wrap p-2 gap-y-1 gap-x-1 justify-start z-[1001]">
        <ToolbarButtonGroup label="Exec">
          {showResume && (
            <ToolbarButton
              bold
              position="left"
              disabled={disableResume}
              className={disableResume ? "" : ""}
              onClick={() => dispatch(resumeFromIter())}
              icon={<FastForwardIcon />}
              label={
                <span>
                  R<b>e</b>sume
                </span>
              }
            />
          )}

          <ToolbarButton
            position={showResume ? "center" : "left"}
            disabled={disableRun}
            onClick={() => dispatch(run())}
            icon={<PlayIcon />}
            label={
              <span>
                <b>R</b>un
              </span>
            }
          />

          <ToolbarButton
            position="right"
            disabled={disableQuit}
            onClick={() => dispatch(stop())}
            icon={<SquareIcon />}
            label={
              <span>
                <b>Q</b>uit
              </span>
            }
          />
        </ToolbarButtonGroup>

        <Seperator />

        <ToolbarButtonGroup label="Spec">
          <ToolbarButton
            position="left"
            disabled={disableGoingForward}
            onClick={() => dispatch(specStep())}
            icon={<ArrowDownToDotIcon />}
            label={
              <span>
                Spec&nbsp;<b>S</b>tep
              </span>
            }
          />

          <ToolbarButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(specStepOver())}
            icon={<RedoDotIcon />}
            label={
              <span>
                <b>O</b>ver
              </span>
            }
          />

          <ToolbarButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(specStepOut())}
            icon={<ArrowUpFromDotIcon />}
            label={
              <span>
                O<b>u</b>t
              </span>
            }
          />

          <ToolbarButton
            position="right"
            disabled={disableGoingForward}
            onClick={() => dispatch(specContinue())}
            icon={<StepForwardIcon />}
            label={
              <span>
                <b>C</b>ontinue
              </span>
            }
          />
        </ToolbarButtonGroup>

        <Seperator />

        <ToolbarButtonGroup label="Back">
          <ToolbarButton
            position="left"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBack())}
            icon={<UndoIcon />}
            label={
              <span>
                Spec&nbsp;<b>B</b>ack
              </span>
            }
          />

          <ToolbarButton
            position="center"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBackOver())}
            icon={<UndoDotIcon />}
            label={
              <span>
                B<b>a</b>ck&nbsp;Over
              </span>
            }
          />

          <ToolbarButton
            position="center"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBackOut())}
            icon={<ArrowUpFromDotIcon />}
            label={
              <span>
                Bac<b>k</b>&nbsp;Out
              </span>
            }
          />

          <ToolbarButton
            position="right"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specRewind())}
            icon={<StepBackIcon />}
            label={
              <span>
                Re<b>w</b>ind
              </span>
            }
          />
        </ToolbarButtonGroup>

        <Seperator />

        <ToolbarButtonGroup label="JS">
          <ToolbarButton
            position="left"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStepStatement())}
            icon={<ArrowDownToDotIcon />}
            label={
              <span>
                <b>J</b>S&nbsp;Step
              </span>
            }
          />

          <ToolbarButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStepOver())}
            icon={<RedoDotIcon />}
            label={
              <span>
                O<b>v</b>er
              </span>
            }
          />

          <ToolbarButton
            position="right"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStepOut())}
            icon={<ArrowUpFromDotIcon />}
            label={
              <span>
                Ou<b>t</b>
              </span>
            }
          />
        </ToolbarButtonGroup>

        {import.meta.env.DEV && (
          <>
            <Seperator />
            <ToolbarButtonGroup label="Iter">
              <ToolbarButton
                position="left"
                disabled={disableGoingForward}
                onClick={() => dispatch(iterPlus())}
                icon={<BugPlayIcon />}
                label={
                  <span>
                    Iter <b>+</b>
                  </span>
                }
              />

              <ToolbarButton
                position="right"
                disabled={disableGoingBackward}
                onClick={() => dispatch(iterMinus())}
                icon={<BugPlayIcon />}
                label={
                  <span>
                    Iter <b>-</b>
                  </span>
                }
              />
            </ToolbarButtonGroup>
          </>
        )}
      </div>
    </aside>
  );
}

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { handleKeyPressBuilder } from "./Toolbar.util";
import { selector } from "./Toolbar.redux";
import { GIVEN_SETTINGS } from "@/constants/settings";

function Seperator() {
  return (
    <div className="h-6 min-w-[1px] max-w-[1px] bg-neutral-200 dark:bg-neutral-700 block">
      &nbsp;
    </div>
  );
}
