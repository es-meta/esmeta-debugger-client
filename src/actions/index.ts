import { createAction } from "@reduxjs/toolkit";

// Debugger Actions

export const runAction = createAction("irState/run");
export const backToProvenanceAction = createAction(
  "irState/backToProvenance",
  (address: string) => ({ payload: address }),
);
export const resumeFromIterAction = createAction("irState/resumeFromIter");
export const stopAction = createAction("irState/stop");

export const iterPlusAction = createAction("irState/iterPlus");
export const iterMinusAction = createAction("irState/iterMinus");

export const continueAction = createAction("irState/continue");
export const rewindAction = createAction("irState/rewind");

export const specStepAction = createAction("irState/specStep");
export const specStepOverAction = createAction("irState/specStepOver");
export const specStepOutAction = createAction("irState/specStepOut");

export const irStepAction = createAction("irState/irStep");
export const irStepOverAction = createAction("irState/irStepOver");
export const irStepOutAction = createAction("irState/irStepOut");

export const specStepBackAction = createAction("irState/specStepBack");
export const specStepBackOverAction = createAction("irState/specStepBackOver");
export const specStepBackOutAction = createAction("irState/specStepBackOut");

export const jsStepStatemmentAction = createAction("irState/jsStepStatement");
export const jsStepAstAction = createAction("irState/jsStepAst");
export const jsStepOverAction = createAction("irState/jsStepOver");
export const jsStepOutAction = createAction("irState/jsStepOut");

// ir state actions
export const updateHeapRequest = createAction("irState/updateHeapRequest");
export const updateCallStackRequest = createAction(
  "irState/updateCallStackRequest",
);
