import produce from "immer";

// redux actions
export enum SpecActionType {
  UPDATE_ALGORITHM_LIST_REQUEST = "SpecActionType/UPDATE_ALGORITHM_LIST_REQUEST",
  UPDATE_ALGORITHM_LIST_SUCCESS = "SpecActionType/UPDATE_ALGORITHM_LIST_SUCCESS",
  UPDATE_BY_FID_REQUEST = "SpecActionType/UPDATE_BY_FID_REQUSET",
  UPDATE_ALGO_SUCCESS = "SpecActionType/UPDATE_ALGO_SUCCESS",
}
export const updateAlgoListRequest = (): SpecAction => ({
  type: SpecActionType.UPDATE_ALGORITHM_LIST_REQUEST,
});
export const updateAlgoListSuccess = (
  nameMap: Record<string, number>, // map from function name to id
): SpecAction => ({
  type: SpecActionType.UPDATE_ALGORITHM_LIST_SUCCESS,
  nameMap,
});
export const updateAlgoByFidRequset = (fid: number): SpecAction => ({
  type: SpecActionType.UPDATE_BY_FID_REQUEST,
  fid,
});
export const updateAlgoSuccess = (algo: Algorithm) => ({
  type: SpecActionType.UPDATE_ALGO_SUCCESS,
  algo,
});
export type SpecAction =
  | {
      type: SpecActionType.UPDATE_BY_FID_REQUEST;
      fid: number;
    }
  | {
      type: SpecActionType.UPDATE_ALGO_SUCCESS;
      algo: Algorithm;
    }
  | {
      type: SpecActionType.UPDATE_ALGORITHM_LIST_REQUEST;
    }
  | {
      type: SpecActionType.UPDATE_ALGORITHM_LIST_SUCCESS;
      nameMap: Record<string, number>;
    };

// redux state
export interface Parameter {
  name: string;
  optional: boolean;
  type: string;
}
export enum AlgorithmKind {
  AbstractOperation,
  NumericMethod,
  SyntaxDirectedOperation,
  ConcreteMethod,
  InternalMethod,
  Builtin,
}
export interface Algorithm {
  fid: number;
  kind: AlgorithmKind;
  name: string;
  params: Parameter[];
  body: string;
  code: string;
}

export type SpecState = {
  algorithm: Algorithm;
  nameMap: Record<string, number>;
};
const initialState: SpecState = {
  algorithm: {
    fid: -1,
    kind: AlgorithmKind.AbstractOperation,
    name: "",
    params: [],
    body: "",
    code: "",
  },
  nameMap: {}, // algoirhtm lists
};

// reducer
export default function reducer(state = initialState, action: SpecAction) {
  switch (action.type) {
    case SpecActionType.UPDATE_ALGO_SUCCESS:
      return produce(state, draft => {
        draft.algorithm = action.algo;
      });
    case SpecActionType.UPDATE_ALGORITHM_LIST_SUCCESS:
      return produce(state, draft => {
        draft.nameMap = action.nameMap;
      });
    default:
      return state;
  }
}
