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
  resumeFromIter,
  specStepBackOut,
} from "@/store/reducers/Debugger";

import ToolbarButton from "@/features/toolbar/ToolbarButton";
import ToolbarButtonGroup from "@/features/toolbar/ToolbarButtonGroup";
import Settings from "../modal/Settings";

export default function Toolbar() {
  const dispatch = useDispatch<Dispatch<DebuggerAction>>();
  const selected = useSelector(selector);
  const { disableRun, disableResume, disableQuit, disableGoingBackward, disableGoingForward } =
    selected;

  const handleKeyPress = useCallback(
    handleKeyPressBuilder(dispatch, selected),
    [dispatch, selected],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <aside className="sticky top-0 w-full backdrop-blur-sm z-[2]">
      <div className="bg-neutral-100 dark:bg-neutral-800 size-full flex-row bg-opacity-75 flex items-center min-h-full space-x-0 flex-wrap p-2 gap-y-2 gap-x-1 justify-start z-[1001]">
        <ToolbarButtonGroup label="Execution">
          <ToolbarButton
            position="left"
            disabled={disableRun}
            onClick={() => dispatch(run())}
            icon={<PlayIcon />}
            label={
              <span>
                <b>R</b>un
              </span>
            }
          />

          {GIVEN_SETTINGS.origin.type === 'visualizer' && (
            <ToolbarButton
              bold
              position="center"
              disabled={disableResume}
              onClick={() => dispatch(resumeFromIter())}
              icon={<PlayIcon />}
              label={
                <span>
                  R<b>e</b>sume&nbsp;from&nbsp;Visualizer
                </span>
              }
            />
          )}

          <ToolbarButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(specContinue())}
            icon={<StepForwardIcon />}
            label={
              <span>
                <b>C</b>ontinue
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
                <b>S</b>tep
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
                Step&nbsp;<b>O</b>ver
              </span>
            }
          />

          <ToolbarButton
            position="right"
            disabled={disableGoingForward}
            onClick={() => dispatch(specStepOut())}
            icon={<ArrowUpFromDotIcon />}
            label={
              <span>
                Step&nbsp;O<b>u</b>t
              </span>
            }
          />
        </ToolbarButtonGroup>

        <Seperator />

        <ToolbarButtonGroup label="Backward">
          <ToolbarButton
            position="left"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBack())}
            icon={<UndoIcon />}
            label={
              <span>
                Step&nbsp;<b>B</b>ack
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
                Step&nbsp;B<b>a</b>ck&nbsp;Over
              </span>
            }
          />

          <ToolbarButton
            position="right"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBackOut())}
            icon={<ArrowUpFromDotIcon />}
            label={
              <span>
                Step&nbsp;Bac<b>k</b>&nbsp;Out
              </span>
            }
          />
        </ToolbarButtonGroup>

        <Seperator />

        <ToolbarButtonGroup label="JS">
          <ToolbarButton
            position="left"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStep())}
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
                JS&nbsp;Step&nbsp;O<b>v</b>er
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
                JS Step&nbsp;Ou<b>t</b>
              </span>
            }
          />
        </ToolbarButtonGroup>

        <Seperator />

        <ConnectStateViewer />
        <Settings />
        <SpecVersionView />
      </div>
    </aside>
  );
}

import ConnectStateViewer from "@/components/custom/ConnectStateViewer";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { handleKeyPressBuilder } from "./Toolbar.util";
import { selector } from "./Toolbar.redux";
import { GIVEN_SETTINGS } from "@/constants/settings";
import SpecVersionView from "../spec/SpecVersionView";

function Seperator() {
  return (
    <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">
      &nbsp;
    </div>
  );
}
