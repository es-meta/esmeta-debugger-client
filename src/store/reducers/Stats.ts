// An internal statistic info from ESMeta for debugging.

import produce from "immer";

// redux actions
export enum StatActionType {
  UPDATE_STAT_REQUEST = "StatActionType/UPDATE_STAT_REQUEST",
  UPDATE_STAT_SUCCESS = "StatActionType/UPDATE_STAT_SUCCESS",
}
export const updateStatRequest = (): StatAction => ({
  type: StatActionType.UPDATE_STAT_REQUEST,
});
export const updateStatSuccess = (debugString: string): StatAction => ({
  type: StatActionType.UPDATE_STAT_SUCCESS,
  debugString,
});

export type StatAction =
  | {
      type: StatActionType.UPDATE_STAT_REQUEST;
    }
  | {
    type: StatActionType.UPDATE_STAT_SUCCESS;
    debugString: string;
    };

// redux state
export type StatState = {
  debugString: string;
};
const initialState: StatState = {
  debugString: "",
};

// reducer
export default function reducer(state = initialState, action: StatAction) {
  switch (action.type) {
    case StatActionType.UPDATE_STAT_SUCCESS:
      return produce(state, draft => {
        draft.debugString = action.debugString;
      });
    default:
      return state;
  }
}
