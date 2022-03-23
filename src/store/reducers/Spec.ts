import produce from "immer";

// redux actions
export enum SpecActionType {
  UPDATE_BY_FID_REQUEST = "SpecActionType/UPDATE_BY_FID_REQUSET",
  UPDATE_ALGO_SUCCESS = "SpecActionType/UPDATE_ALGO_SUCCESS",
}
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
  kind: AlgorithmKind;
  name: string;
  params: Parameter[];
  body: string;
  code: string;
}

export type SpecState = {
  algorithm: Algorithm;
};
const initialState: SpecState = {
  algorithm: {
    kind: AlgorithmKind.AbstractOperation,
    name: "",
    params: [],
    body: "",
    code: "",
  },
};

// reducer
export default function reducer(state = initialState, action: SpecAction) {
  switch (action.type) {
    case SpecActionType.UPDATE_ALGO_SUCCESS:
      return produce(state, draft => {
        draft.algorithm = action.algo;
      });
    default:
      return state;
  }
}
