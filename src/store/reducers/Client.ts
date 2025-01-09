import produce from "immer";

// redux actions
export enum ClientActionType {
  CHOOSE_STATEVIEWER = "ClientActionType/CHOOSE_STATEVIEWER",
  SET_HEAP_ADDR = "ClientActionType/SET_HEAP_ADDR",
  // UPDATE_ALGORITHM_LIST_REQUEST = "SpecActionType/UPDATE_ALGORITHM_LIST_REQUEST",
  // UPDATE_ALGORITHM_LIST_SUCCESS = "SpecActionType/UPDATE_ALGORITHM_LIST_SUCCESS",
  // UPDATE_BY_CID_REQUEST = "SpecActionType/UPDATE_BY_CID_REQUSET",
  // UPDATE_ALGO_SUCCESS = "SpecActionType/UPDATE_ALGO_SUCCESS",
  // UPDATE_VERSION_REQUEST = "SpecActionType/UPDATE_VERSION_REQUEST",
  // UPDATE_VERSION_SUCCESS = "SpecActionType/UPDATE_VERSION_SUCCESS",
  // TOGGLE_CALLSTACK_FOLD = "SpecActionType/TOGGLE_CALLSTACK_FOLD",
  // CLEAR = "SpecActionType/CLEAR",
}
export const chooseStateViewer = (view: StateViewerView): ClientAction => ({
  type: ClientActionType.CHOOSE_STATEVIEWER,
  view,
});
export const setHeapViewerAddr = (heapAddr: string | null): ClientAction => ({
  type: ClientActionType.SET_HEAP_ADDR,
  addr: heapAddr,
});

type StateViewerView = "env" | "heap" | "callstack" | "bp";

export type ClientAction =
  | {
      type: ClientActionType.CHOOSE_STATEVIEWER;
      view: StateViewerView;
    }
  | {
      type: ClientActionType.SET_HEAP_ADDR;
      addr: string | null;
    };
// | {
//     type: SpecActionType.UPDATE_BY_CID_REQUEST;
//     cid: number;
//   }
// | {
//     type: SpecActionType.UPDATE_ALGO_SUCCESS;
//     algo: Algorithm;
//   }
// | {
//     type: SpecActionType.UPDATE_ALGORITHM_LIST_REQUEST;
//   }
// | {
//     type: SpecActionType.UPDATE_ALGORITHM_LIST_SUCCESS;
//     nameMap: Record<string, number>;
//   }
// | {
//     type: SpecActionType.UPDATE_VERSION_REQUEST;
//   }
// | {
//     type: SpecActionType.UPDATE_VERSION_SUCCESS;
//     version: SpecVersion;
//   }
// | {
//     type: SpecActionType.TOGGLE_CALLSTACK_FOLD;
//     name: string;
//     boolean: boolean;
//   }
// | {
//     type: SpecActionType.CLEAR;
//   };

// redux state
export type ClientState = {
  stateviewer: {
    view: StateViewerView;
    addr: string | null;
  };
};
const initialState: ClientState = {
  stateviewer: {
    view: "env",
    addr: null,
  },
};

// reducer
export default function reducer(state = initialState, action: ClientAction) {
  switch (action.type) {
    case ClientActionType.CHOOSE_STATEVIEWER:
      return produce(state, draft => {
        draft.stateviewer.view = action.view;
      });
    case ClientActionType.SET_HEAP_ADDR:
      return produce(state, draft => {
        draft.stateviewer.addr = action.addr;
      });
    // case SpecActionType.UPDATE_ALGO_SUCCESS:
    //   return produce(state, draft => {
    //     draft.algorithm = action.algo;
    //   });
    // case SpecActionType.UPDATE_ALGORITHM_LIST_SUCCESS:
    //   return produce(state, draft => {
    //     draft.nameMap = action.nameMap;
    //   });
    // case SpecActionType.UPDATE_VERSION_SUCCESS:
    //   return produce(state, draft => {
    //     draft.version = action.version;
    //   });
    // case SpecActionType.CLEAR:
    //   return produce(state, draft => {
    //     draft.algorithm = initialState.algorithm;
    //   });
    // case SpecActionType.TOGGLE_CALLSTACK_FOLD:
    //   return produce(state, draft => {
    //     draft.toggleMap[action.name] = action.boolean;
    //   });
    default:
      return state;
  }
}
