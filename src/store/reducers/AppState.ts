import produce from "immer";

// app state
export enum AppState {
  INIT = "AppState/INIT",
  JS_INPUT = "AppState/JS_INPUT",
  TERMINATED = "AppState/TERMINATED",
  DEBUG_READY = "AppState/DEBUG_READY",
  DEBUG_READY_AT_FRONT = "AppState/DEBUG_READY_AT_FRONT",
}

// redux actions
export enum AppStateActionType {
  MOVE = "ConnectionStateAction/MOVE",
  SEND = "ConnectionStateAction/SEND",
  RECEIVE = "ConnectionStateAction/RECEIVE",
  TIMEOUT = "ConnectionStateAction/TIMEOUT",
  TOGGLE_IGNORE = "ConnectionStateAction/TOGGLE_IGNORE",
}

export function move(nextState: AppState): AppStateAction {
  return {
    type: AppStateActionType.MOVE,
    nextState,
  };
}
export type AppStateAction =
  | {
      type: AppStateActionType.MOVE;
      nextState: AppState;
    }
  | {
      type: AppStateActionType.SEND;
    }
  | {
      type: AppStateActionType.RECEIVE;
    }
  | {
      type: AppStateActionType.TIMEOUT;
    }
  | {
    type: AppStateActionType.TOGGLE_IGNORE;
  }

// redux state
export type AppStateState = {
  state: AppState;
  busy: number;
  ignoreBP: boolean,
};

const initialState: AppStateState = { state: AppState.INIT, busy: -0, ignoreBP: false };

import { workingset } from "@/util/api/api";

// reducer
export default function reducer(state = initialState, action: AppStateAction) {
  switch (action.type) {
    case AppStateActionType.MOVE:
      return produce(state, draft => {
        draft.state = action.nextState;
        draft.busy = workingset.size;
      });

    case AppStateActionType.SEND:
      return produce(state, draft => {
        draft.busy += 1;
      });

    case AppStateActionType.RECEIVE:
      return produce(state, draft => {
        draft.busy = workingset.size;
      });

    case AppStateActionType.TIMEOUT:
      return produce(state, draft => {
        draft.busy = workingset.size;
      });

    case AppStateActionType.TOGGLE_IGNORE:
      return produce(state, draft => {
        draft.ignoreBP = !draft.ignoreBP;
      })

    default:
      return state;
  }
}
