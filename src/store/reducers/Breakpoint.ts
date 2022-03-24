import produce from "immer";

// redux actions
export enum BreakpointActionType {
  ADD_BREAK = "BreakpointAction/ADD_BREAK",
  RM_BREAK = "BreakpointAction/RM_BREAK",
  TOGGLE_BREAK = "BreakpointAction/TOGGLE_BREAK",
}
export const addBreak = (bp: Breakpoint): BreakpointAction => ({
  type: BreakpointActionType.ADD_BREAK,
  bp,
});
export const rmBreak = (opt: string | number): BreakpointAction => ({
  type: BreakpointActionType.RM_BREAK,
  opt,
});
export const toggleBreak = (opt: string | number): BreakpointAction => ({
  type: BreakpointActionType.TOGGLE_BREAK,
  opt,
});
export type BreakpointAction =
  | {
      type: BreakpointActionType.ADD_BREAK;
      bp: Breakpoint;
    }
  | {
      type: BreakpointActionType.RM_BREAK;
      opt: string | number;
    }
  | {
      type: BreakpointActionType.TOGGLE_BREAK;
      opt: string | number;
    };

// type
export interface Breakpoint {
  fid: number;
  name: string;
  // TODO steps: number[] | null;
  enabled: boolean;
}

// redux state
type BreakpointState = {
  items: Breakpoint[];
};

const initialState: BreakpointState = {
  items: [],
};

// reducer
export default function reducer(
  state = initialState,
  action: BreakpointAction,
) {
  switch (action.type) {
    case BreakpointActionType.ADD_BREAK:
      return produce(state, draft => {
        draft.items.push(action.bp);
      });
    case BreakpointActionType.RM_BREAK:
      return produce(state, draft => {
        if (action.opt === "all") draft.items = [];
        else draft.items.splice(Number(action.opt), 1);
      });
    case BreakpointActionType.TOGGLE_BREAK:
      return produce(state, draft => {
        if (action.opt === "all")
          draft.items.forEach(bp => (bp.enabled = !bp.enabled));
        else {
          const i = Number(action.opt);
          draft.items[i].enabled = !draft.items[i].enabled;
        }
      });
    default:
      return state;
  }
}
