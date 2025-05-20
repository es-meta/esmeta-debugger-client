import { useCallback, useEffect } from "react";
import ToolbarButton from "@/features/toolbar/button";
import ToolbarButtonGroup from "@/features/toolbar/group";
import { handleKeyPressBuilder } from "./utils";
import { givenConfigAtom } from "@/atoms/defs/config";
import { selectorAtom } from "./atoms";
import { atoms, useAtomValue } from "@/atoms";
import { useDebuggerActions } from "@/hooks/use-debugger-actions";

import {
  ArrowDownToDotIcon,
  ArrowUpFromDotIcon,
  PlayIcon,
  RedoDotIcon,
  SquareIcon,
  StepForwardIcon,
  UndoDotIcon,
  UndoIcon,
  FastForwardIcon,
  BugPlayIcon,
  RewindIcon,
} from "lucide-react";

export function Toolbar() {
  const devMode = useAtomValue(atoms.app.devModeAtom);
  const actions = useDebuggerActions();
  const {
    disableRun,
    disableResume,
    disableQuit,
    disableGoingBackward,
    disableGoingForward,
    ignoreBP,
  } = useAtomValue(selectorAtom);

  const handleKeyPress = useCallback(
    handleKeyPressBuilder(
      actions,
      {
        disableRun,
        disableResume,
        disableQuit,
        disableGoingBackward,
        disableGoingForward,
        ignoreBP,
      },
      devMode,
    ),
    [
      devMode,
      actions,
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
    <aside className="relative w-full backdrop-blur-xs z-2">
      <div className="size-full flex-row bg-opacity-75 flex items-center min-h-full flex-wrap whitespace-pre-wrap pb-2 gap-y-1 justify-start z-1001">
        <ToolbarButtonGroup label="Exec">
          {showResume && (
            <ToolbarButton
              position="left"
              disabled={disableResume}
              className="bg-linear-to-r from-es-400/50 to-es-400/15 dark:from-es-900/50 dark:to-es-900/15"
              onClick={() => actions.resume()}
              icon={<StepForwardIcon />}
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
            onClick={() => actions.run()}
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
            onClick={() => actions.stop()}
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
            onClick={() => actions.specStep()}
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
            onClick={() => actions.specStepOver()}
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
            onClick={() => actions.specStepOut()}
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
            onClick={() => actions.specContinue()}
            icon={<FastForwardIcon />}
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
            onClick={() => actions.specStepBack()}
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
            onClick={() => actions.specStepBackOver()}
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
            onClick={() => actions.specStepBackOut()}
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
            onClick={() => actions.specRewind()}
            icon={<RewindIcon />}
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
            onClick={() => actions.esStepStatement()}
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
              onClick={() => actions.esStepAst()}
              icon={<ArrowDownToDotIcon />}
              label={
                <span>
                  AST&nbsp;Ste<b>p</b>
                </span>
              }
            />
          )}

          <ToolbarButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => actions.esStepOver()}
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
            onClick={() => actions.esStepOut()}
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
                onClick={() => actions.stepCntPlus()}
                icon={<BugPlayIcon />}
                label={<span>StepCnt +</span>}
              />

              <ToolbarButton
                position="right"
                disabled={disableGoingBackward}
                onClick={() => actions.stepCntMinus()}
                icon={<BugPlayIcon />}
                label={<span>StepCnt -</span>}
              />
              <ToolbarButton
                position="left"
                disabled={disableGoingForward}
                onClick={() => actions.instCntPlus()}
                icon={<BugPlayIcon />}
                label={<span>Iter +</span>}
              />

              <ToolbarButton
                position="right"
                disabled={disableGoingBackward}
                onClick={() => actions.instCntMinus()}
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
    <div className="h-6 px-1 flex flex-row items-center">
      <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
}
