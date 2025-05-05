import { useCallback, useEffect } from "react";
import ToolbarButton from "@/features/toolbar/ToolbarButton";
import ToolbarButtonGroup from "@/features/toolbar/ToolbarButtonGroup";

import { handleKeyPressBuilder } from "./Toolbar.util";
import { givenConfigAtom } from "@/atoms/defs/config";

export default function Toolbar() {
  const dispatch = useAppDispatch();
  const devMode = useAppSelector(st => st.appState.devMode);
  const {
    disableRun,
    disableResume,
    disableQuit,
    disableGoingBackward,
    disableGoingForward,
    ignoreBP,
  } = useAppSelector(selector);

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

  const givenConfig = useAtomValue(givenConfigAtom);
  const showResume = givenConfig.origin.type === "visualizer";

  return (
    <aside className="relative w-full backdrop-blur-sm z-[2]">
      <div className="size-full flex-row bg-opacity-75 flex items-center min-h-full flex-wrap whitespace-pre-wrap pb-2 gap-y-1 justify-start z-[1001]">
        <ToolbarButtonGroup label="Exec">
          {showResume && (
            <ToolbarButton
              position="left"
              disabled={disableResume}
              className="bg-gradient-to-r from-es-900/50 to-es-900/15"
              onClick={() => dispatch(resumeFromIterAction())}
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
            onClick={() => dispatch(runAction())}
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
            onClick={() => dispatch(stopAction())}
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
            onClick={() => dispatch(specStepAction())}
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
            onClick={() => dispatch(specStepOverAction())}
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
            onClick={() => dispatch(specStepOutAction())}
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
            onClick={() => dispatch(continueAction())}
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
            onClick={() => dispatch(specStepBackAction())}
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
            onClick={() => dispatch(specStepBackOverAction())}
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
            onClick={() => dispatch(specStepBackOutAction())}
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
            onClick={() => dispatch(rewindAction())}
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
            onClick={() => dispatch(jsStepStatemmentAction())}
            icon={<ArrowDownToDotIcon />}
            label={
              <span>
                <b>J</b>S&nbsp;Step
              </span>
            }
          />

          {devMode && (
            <ToolbarButton
              position="center"
              disabled={disableGoingForward}
              onClick={() => dispatch(jsStepAstAction())}
              icon={<ArrowDownToDotIcon />}
              label={<span>AST&nbsp;Step</span>}
            />
          )}

          <ToolbarButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStepOverAction())}
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
            onClick={() => dispatch(jsStepOutAction())}
            icon={<ArrowUpFromDotIcon />}
            label={
              <span>
                Ou<b>t</b>
              </span>
            }
          />
        </ToolbarButtonGroup>

        {devMode && (
          <>
            <Seperator />
            <ToolbarButtonGroup label="Iter">
              <ToolbarButton
                position="left"
                disabled={disableGoingForward}
                onClick={() => dispatch(iterPlusAction())}
                icon={<BugPlayIcon />}
                label={<span>Iter +</span>}
              />

              <ToolbarButton
                position="right"
                disabled={disableGoingBackward}
                onClick={() => dispatch(iterMinusAction())}
                icon={<BugPlayIcon />}
                label={<span>Iter -</span>}
              />
            </ToolbarButtonGroup>
          </>
        )}
      </div>
    </aside>
  );
}

function Seperator() {
  return (
    <div className="h-6 px-1 flex flex-row">
      <div className="w-[1px] h-6 bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
}

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
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selector } from "./Toolbar.atom";
import { useAtomValue } from "jotai";
import {
  continueAction,
  iterMinusAction,
  iterPlusAction,
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
