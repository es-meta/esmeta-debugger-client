import { atom } from "jotai";
import { resultAtom } from "@/atoms/defs/state";
import { appState, ignoreBPAtom, jsCodeAtom } from "@/atoms/defs/app";
import { AppState, Route, StepResultAdditional } from "@/types";
import { doAPIPostRequest } from "@/api";
import { serializedBpAtom } from "@/atoms/defs/bp";
import { givenConfigAtom } from "@/atoms/defs/config";
import { toast } from "react-toastify";

function actionWithOpts(endpoint: Route) {
  return atom(null, async (_get, set) => {
    const ignoreBp = _get(ignoreBPAtom);
    set(
      resultAtom,
      doAPIPostRequest(endpoint, ignoreBp) as Promise<StepResultAdditional>,
    );
  });
}

function actionWithPayload<T>(endpoint: Route) {
  return atom(null, async (_get, set, payload: T) => {
    set(
      resultAtom,
      doAPIPostRequest(endpoint, payload) as Promise<StepResultAdditional>,
    );
  });
}

export const runAction = atom(null, async (get, set) => {
  const code = get(jsCodeAtom);
  const breakpoints = get(serializedBpAtom);
  set(
    resultAtom,
    doAPIPostRequest("exec/run", [
      code,
      breakpoints,
    ]) as Promise<StepResultAdditional>,
  );
});

// TODO
export const resumeAction = atom(null, async (get, set) => {
  const code = get(jsCodeAtom);
  const breakpoints = get(serializedBpAtom);
  const config = get(givenConfigAtom);
  const origin = config.origin;
  if (origin.type === "visualizer") {
    set(
      resultAtom,
      doAPIPostRequest("exec/resumeFromIter", [
        code,
        breakpoints,
        origin.iter,
      ]) as Promise<StepResultAdditional>,
    );
  } else {
    toast.error("Invalid origin type");
  }
});

export const backToProvenanceAction = actionWithPayload(
  "exec/backToProvenance",
);

export const stopAction = atom(null, async (get, set) => {
  set(resultAtom, null);
  set(appState, AppState.JS_INPUT);
});

export const specContinueAction = actionWithOpts("exec/specContinue");
export const specRewindAction = actionWithOpts("exec/specRewind");

export const specStepAction = actionWithOpts("exec/specStep");
export const specStepOverAction = actionWithOpts("exec/specStepOver");
export const specStepOutAction = actionWithOpts("exec/specStepOut");

export const specStepBackAction = actionWithOpts("exec/specStepBack");
export const specStepBackOverAction = actionWithOpts("exec/specStepBackOver");
export const specStepBackOutAction = actionWithOpts("exec/specStepBackOut");

export const irStepAction = actionWithOpts("exec/irStep");
export const irStepOverAction = actionWithOpts("exec/irStepOver");
export const irStepOutAction = actionWithOpts("exec/irStepOut");

export const jsStepStatementAction = actionWithOpts("exec/esStatementStep");
export const jsStepAstAction = actionWithOpts("exec/esAstStep");
export const jsStepOverAction = actionWithOpts("exec/esStepOver");
export const jsStepOutAction = actionWithOpts("exec/esStepOut");

export const stepCntPlusAction = actionWithOpts("exec/stepCntPlus");
export const stepCntMinusAction = actionWithOpts("exec/stepCntMinus");

export const instCntPlusAction = actionWithOpts("exec/instCntPlus");
export const instCntMinusAction = actionWithOpts("exec/instCntMinus");
