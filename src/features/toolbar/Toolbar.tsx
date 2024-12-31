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
} from "@/store/reducers/Debugger";

import ActionButton from "../../components/button/ActionButton";
import CollapsableButtonGroup from "../../components/button/CollapsableButtonGroup";
import Settings from "../modal/Settings";

export default function Toolbar() {
  const dispatch = useDispatch<Dispatch<DebuggerAction>>();
  const { disableRun, disableGoingBackward, disableGoingForward } = useSelector(
    (st: ReduxState) => ({
      disableRun: !(st.appState.state === AppState.JS_INPUT),
      disableGoingForward: !(
        st.appState.state === AppState.DEBUG_READY ||
        st.appState.state === AppState.DEBUG_READY_AT_FRONT
      ),
      disableGoingBackward: !(
        st.appState.state === AppState.DEBUG_READY ||
        st.appState.state === AppState.TERMINATED
      ),
    }),
  );

  const handleKeyPress = useCallback(handleKeyPressBuilder(dispatch), [
    dispatch,
  ]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const emphasize = "text-es";

  return (
    <aside className="sticky top-0 w-full backdrop-blur-sm z-[2]">
      <div className="bg-neutral-100 size-full flex-row bg-opacity-75 flex items-center min-h-full space-x-0 flex-wrap p-2 gap-y-2 gap-x-1 justify-start z-[1001]">
        <CollapsableButtonGroup>
          <ActionButton
            position="left"
            disabled={disableRun}
            onClick={() => dispatch(run())}
          >
            <PlayIcon />
            <span>
              <span className={emphasize}>R</span>
              <span>un</span>
            </span>
          </ActionButton>

          <ActionButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(specContinue())}
          >
            <StepForwardIcon />
            <span>
              <span className={emphasize}>C</span>
              ontinue
            </span>
          </ActionButton>

          <ActionButton
            position="right"
            disabled={!disableRun}
            onClick={() => dispatch(stop())}
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
            disabled={disableGoingForward}
            onClick={() => dispatch(specStep())}
          >
            <ArrowDownToDotIcon />
            <span>
              <span className={emphasize}>S</span>
              <span>tep</span>
            </span>
          </ActionButton>
          <ActionButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(specStepOver())}
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
            disabled={disableGoingForward}
            onClick={() => dispatch(specStepOut())}
          >
            <ArrowUpFromDotIcon />
            <span>
              Step&nbsp;O
              <span className={emphasize}>u</span>t
            </span>
          </ActionButton>

          <ActionButton
            position="center"
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBack())}
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
            disabled={disableGoingBackward}
            onClick={() => dispatch(specStepBackOver())}
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
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStep())}
          >
            <ArrowDownToDotIcon />
            <span>
              <span className={emphasize}>J</span>S Step
            </span>
          </ActionButton>
          <ActionButton
            position="center"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStepOver())}
          >
            <RedoDotIcon />
            <span>
              JS Step O<span className={emphasize}>v</span>
              er
            </span>
          </ActionButton>

          <ActionButton
            position="right"
            disabled={disableGoingForward}
            onClick={() => dispatch(jsStepOut())}
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

        <div className="w-16 h-4">{/* <ConnectStateViewer /> */}</div>
        <Settings />
      </div>
    </aside>
  );
}

import ConnectStateViewer from "@/components/custom/ConnectStateViewer";
import { AppState } from "@/store/reducers/AppState";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { Dispatch } from "redux";
import { handleKeyPressBuilder } from "./Toolbar.util";
