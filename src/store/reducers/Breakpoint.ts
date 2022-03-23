import produce from "immer";

// redux actions
export enum BreakpointActionType {
  ADD_BREAK = "BreakpointAction/ADD_BREAK",
  RM_BREAK = "BreakpointAction/RM_BREAK",
  TOGGLE_BREAK = "BreakpointAction/TOGGLE_BREAK",
}
export const addBreak = (bpName: string): BreakpointAction => ({
  type: BreakpointActionType.ADD_BREAK,
  bpName,
});
export const rmBreak = (opt: string): BreakpointAction => ({
  type: BreakpointActionType.RM_BREAK,
  opt,
});
export const toggleBreak = (opt: string): BreakpointAction => ({
  type: BreakpointActionType.TOGGLE_BREAK,
  opt,
});
export type BreakpointAction =
  | {
      type: BreakpointActionType.ADD_BREAK;
      bpName: string;
    }
  | {
      type: BreakpointActionType.RM_BREAK;
      opt: string;
    }
  | {
      type: BreakpointActionType.TOGGLE_BREAK;
      opt: string;
    };

// redux state
type BreakpointState = {
  items: unknown[]; // TODO
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
        console.log(action);
        draft.items.push({ name: action.bpName, enabled: true });
      });
    case BreakpointActionType.RM_BREAK:
      return produce(state, draft => {
        if (action.opt === "all") draft.items = [];
        else draft.items.splice(Number(action.opt), 1);
      });
    // case BreakpointActionType.TOGGLE_BREAK:
    //   return produce(state, draft => {
    //     if (action.opt === "all")
    //       draft.breakpoints.forEach(bp => (bp.enabled = !bp.enabled));
    //     else {
    //       const i = Number(action.opt);
    //       draft.breakpoints[i].enabled = !draft.breakpoints[i].enabled;
    //     }
    //   });
    default:
      return state;
  }
}
