import produce from "immer";

// redux actions
export enum SpecActionType {
  UPDATE_ALGORITHM_LIST_REQUEST = "SpecActionType/UPDATE_ALGORITHM_LIST_REQUEST",
  UPDATE_ALGORITHM_LIST_SUCCESS = "SpecActionType/UPDATE_ALGORITHM_LIST_SUCCESS",
  UPDATE_BY_CID_REQUEST = "SpecActionType/UPDATE_BY_CID_REQUSET",
  UPDATE_ALGO_SUCCESS = "SpecActionType/UPDATE_ALGO_SUCCESS",
  UPDATE_VERSION_REQUEST = "SpecActionType/UPDATE_VERSION_REQUEST",
  UPDATE_VERSION_SUCCESS = "SpecActionType/UPDATE_VERSION_SUCCESS",
  UPDATE_IR_TO_SPEC_MAP_REQUEST = "SpecActionType/UPDATE_IR_TO_SPEC_MAP_REQUEST",
  UPDATE_IR_TO_SPEC_MAP_SUCCESS = "SpecActionType/UPDATE_IR_TO_SPEC_MAP_SUCCESS",
  CLEAR = "SpecActionType/CLEAR",
}
export const updateAlgoListRequest = (): SpecAction => ({
  type: SpecActionType.UPDATE_ALGORITHM_LIST_REQUEST,
});
export const updateAlgoListSuccess = (
  nameMap: Record<string, number>, // map from function name to id
  irToSpecMapping: Record<string, SpecFuncInfo>, // map from ir function name to spec function name
): SpecAction => ({
  type: SpecActionType.UPDATE_ALGORITHM_LIST_SUCCESS,
  nameMap,
  irToSpecMapping,
});
export const updateAlgoByCidRequset = (cid: number): SpecAction => ({
  type: SpecActionType.UPDATE_BY_CID_REQUEST,
  cid,
});
export const updateAlgoSuccess = (algo: Algorithm) => ({
  type: SpecActionType.UPDATE_ALGO_SUCCESS,
  algo,
});
export const updateVersionRequest = (): SpecAction => ({
  type: SpecActionType.UPDATE_VERSION_REQUEST,
});
export const updateVersionSuccess = (specVersion: SpecVersion, esmetaVersion: string): SpecAction => ({
  type: SpecActionType.UPDATE_VERSION_SUCCESS,
  specVersion,
  esmetaVersion, 
});
export const clearAlgo = (): SpecAction => ({
  type: SpecActionType.CLEAR,
});

export type SpecAction =
  | {
      type: SpecActionType.UPDATE_BY_CID_REQUEST;
      cid: number;
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
    irToSpecMapping: Record<string, SpecFuncInfo>;
    }
  | {
      type: SpecActionType.UPDATE_VERSION_REQUEST;
    }
  | {
      type: SpecActionType.UPDATE_VERSION_SUCCESS;
    specVersion: SpecVersion;
    esmetaVersion: string | null;
    }
  | {
      type: SpecActionType.CLEAR;
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
  dot: string;
  code: string;
}

export interface SpecVersion {
  hash: string | null;
  tag: string | null;
}

export type SpecFuncInfo = {
  name: string;
  htmlId: string;
  isBuiltIn: boolean;
  isSdo: boolean;
  sdoInfo: SdoInfo | null;
}

type SdoInfo = {
  method: string;
  type: "default" | "base";
  prod: {
    i: number;
    j: number;
    astName: string;
    prodInfo: {
        type: "terminal" | "nonterminal";
        value: string;
    }[];
  } | null;
}


// "prodInfo" -> cfg.grammar.prods
//                                               .find(_.name == name)
//                                               .map { prod =>
//                                                 val rhs = prod.rhsVec(i)
//                                                 rhs
//                                                   .getSymbols(j)
//                                                   .flatMap(x => x)
//                                                   .flatMap {
//                                                     symbol => (symbol.getT, symbol.getNt) match
//                                                     case (Some(t), None) => Some(Json.obj(
//                                                       "type" -> "terminal".asJson,
//                                                       "value" -> t.term.asJson
//                                                     ))
//                                                     case (None, Some(nt)) => Some(Json.obj(
//                                                       "type" -> "nonterminal".asJson,
//                                                       "value" -> nt.name.asJson,
//                                                     ))
//                                                     case _ => None
//                                                   }
//                                               }
//                                               .asJson,

// Json
//                         .obj(
//                           "name" -> algo.normalizedName.asJson,
//                           "htmlId" -> algo.elem.parent().id().asJson,
//                           "isSdo" -> f.isSDO.asJson,
//                           "sdoInfo" -> f.sdoInfo
//                             .map((info: SdoInfo) =>
//                               Json
//                                 .obj(
//                                   "method" -> info.method.asJson,
//                                   "type" -> (
//                                     info match
//                                       case _: SdoInfo.Default => "default"
//                                       case _: SdoInfo.Base => "base"
//                                   ).asJson,
//                                   "prod" -> (
//                                     info match
//                                       case SdoInfo.Base(_, name, i, j, _) =>
//                                         Some(
//                                           Json.obj(
//                                             "i" -> i.asJson,
//                                             "j" -> j.asJson,
//                                             "astName" -> name.asJson,
//                                             // "what???" -> cfg.grammar.prods
//                                             //   .find(_.name == name)
//                                             //   .map(
//                                             //     prod =>  prod.rhsVec.lift(i).map(
//                                             //       rhs => rhs.
//                                             //     )
//                                             //   ).map(_.asJson),
//                                             )
//                                           )
                                              
//                                       case _ => None
//                                   ).asJson,
//                                 )
//                                 .asJson,
//                             )
//                             .asJson,
//                         ),

export type SpecState = {
  algorithm: Algorithm;
  nameMap: Record<string, number>;
  toggleMap: Record<string, boolean>; // ir function name to fold state, TODO remove
  irToSpecMapping: Record<string, SpecFuncInfo>;
  version: { spec: SpecVersion, esmeta: string | null };
};
const initialState: SpecState = {
  algorithm: {
    fid: -1,
    kind: AlgorithmKind.AbstractOperation,
    name: "",
    params: [],
    dot: "",
    code: "",
  },
  nameMap: {}, // algoirhtm lists
  toggleMap: {}, 
  irToSpecMapping: {},
  version: {
    spec: {
      hash: null,
      tag: null,
    },
    esmeta: null,
  },
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
        draft.irToSpecMapping = action.irToSpecMapping;
      });
    case SpecActionType.UPDATE_VERSION_SUCCESS:
      return produce(state, draft => {
        draft.version.spec = action.specVersion;
        draft.version.esmeta = action.esmetaVersion;
      });
    case SpecActionType.CLEAR:
      return produce(state, draft => {
        draft.algorithm = initialState.algorithm;
      });
    default:
      return state;
  }
}
