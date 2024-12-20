import produce from "immer";


// app state
export enum AppState {
  INIT = "AppState/INIT",
  JS_INPUT = "AppState/JS_INPUT",
  TERMINATED = "AppState/TERMINATED",
  DEBUG_READY = "AppState/DEBUG_READY",
}

// redux actions
export enum AppStateActionType {
  MOVE = "ConnectionStateAction/MOVE",
  SEND = "ConnectionStateAction/SEND",
  RECIEVE = "ConnectionStateAction/RECIEVE",
  TIMEOUT = "ConnectionStateAction/TIMEOUT",
}

export function move(nextState: AppState): AppStateAction {
  return {
    type: AppStateActionType.MOVE,
    nextState,
  };
}
export type AppStateAction = {
  type: AppStateActionType.MOVE;
  nextState: AppState;
} | {
  type: AppStateActionType.SEND;
} | {
  type: AppStateActionType.RECIEVE;
} | {
  type: AppStateActionType.TIMEOUT;
};

// redux state
type AppStateState = {
  state: AppState;
  busy: number;
};



const initialState: AppStateState = { state: AppState.INIT, busy: -0 };

// reducer
export default function reducer(state = initialState, action: AppStateAction) {
  switch (action.type) {
    case AppStateActionType.MOVE:
      return produce(state, draft => {
        draft.state = action.nextState;
      });
    
    case AppStateActionType.SEND:
      return produce(state, draft => {
        draft.busy += 1;
      });
    
    case AppStateActionType.RECIEVE:
      return produce(state, draft => {
        draft.busy -= 1;
      });
    
    case AppStateActionType.TIMEOUT:
      return produce(state, draft => {
        draft.busy -= 1;
      });
    
    default:
      return state;
  }
}
