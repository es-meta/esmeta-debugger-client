import { useSetAtom } from "jotai";
import {
  runAction,
  stopAction,
  specStepAction,
  specStepOutAction,
  specStepOverAction,
  specStepBackAction,
  specStepBackOverAction,
  specStepBackOutAction,
  irStepAction,
  irStepOverAction,
  irStepOutAction,
  jsStepAstAction,
  jsStepOutAction,
  jsStepOverAction,
  instCntPlusAction,
  instCntMinusAction,
  specContinueAction,
  specRewindAction,
  jsStepStatementAction,
  stepCntPlusAction,
  stepCntMinusAction,
  resumeAction,
} from "@/actions";

export function useDebuggerActions() {
  const run = useSetAtom(runAction);
  const resume = useSetAtom(resumeAction);
  const stop = useSetAtom(stopAction);

  const specStep = useSetAtom(specStepAction);
  const specStepOver = useSetAtom(specStepOverAction);
  const specStepOut = useSetAtom(specStepOutAction);

  const specStepBack = useSetAtom(specStepBackAction);
  const specStepBackOver = useSetAtom(specStepBackOverAction);
  const specStepBackOut = useSetAtom(specStepBackOutAction);

  const irStep = useSetAtom(irStepAction);
  const irStepOver = useSetAtom(irStepOverAction);
  const irStepOut = useSetAtom(irStepOutAction);

  const esStepStatement = useSetAtom(jsStepStatementAction);
  const esStepAst = useSetAtom(jsStepAstAction);
  const esStepOver = useSetAtom(jsStepOverAction);
  const esStepOut = useSetAtom(jsStepOutAction);

  const stepCntPlus = useSetAtom(stepCntPlusAction);
  const stepCntMinus = useSetAtom(stepCntMinusAction);

  const instCntPlus = useSetAtom(instCntPlusAction);
  const instCntMinus = useSetAtom(instCntMinusAction);

  const specContinue = useSetAtom(specContinueAction);
  const specRewind = useSetAtom(specRewindAction);

  return {
    run,
    resume,
    stop,
    specStep,
    specStepOver,
    specStepOut,
    specStepBack,
    specStepBackOver,
    specStepBackOut,
    irStep,
    irStepOver,
    irStepOut,
    esStepStatement,
    esStepAst,
    esStepOver,
    esStepOut,
    stepCntPlus,
    stepCntMinus,
    instCntPlus,
    instCntMinus,
    specContinue,
    specRewind,
  };
}
