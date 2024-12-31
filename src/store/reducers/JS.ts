import { FALLBACK_CODE, QUERY_PROG } from "@/constants/constant";
import { getSearchQuery } from "@/util/query.util";
import produce from "immer";

// redux actions
export enum JSActionType {
  EDIT = "JSAction/EDIT",
  CLEAR = "JSAction/CLEAR",
  UPDATE_RANGE = "JSAction/UPDATE_RANGE",
}
export const edit = (code: string): JSAction => ({
  type: JSActionType.EDIT,
  code,
});
export const updateRange = (start: number, end: number): JSAction => ({
  type: JSActionType.UPDATE_RANGE,
  start,
  end,
});
export const clearJS = (): JSAction => ({
  type: JSActionType.CLEAR,
});

export type JSAction =
  | {
      type: JSActionType.EDIT;
      code: string;
    }
  | {
      type: JSActionType.CLEAR;
    }
  | {
      type: JSActionType.UPDATE_RANGE;
      start: number;
      end: number;
    };

// redux state
type JSState = {
  code: string;
  start: number;
  end: number;
};
const initialState: JSState = {
  code: getSearchQuery(QUERY_PROG) || FALLBACK_CODE ,
  start: -1,
  end: -1,
};

// reducer
export default function reducer(state = initialState, action: JSAction) {
  switch (action.type) {
    case JSActionType.EDIT:
      return produce(state, draft => {
        draft.code = action.code;
      });
    case JSActionType.CLEAR:
      return produce(state, draft => {
        draft.start = -1;
        draft.end = -1;
      });
    case JSActionType.UPDATE_RANGE:
      return produce(state, draft => {
        draft.start = action.start;
        draft.end = action.end;
      });
    default:
      return state;
  }
}
