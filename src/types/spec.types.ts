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

export interface SpecVersion {
  hash: string | null;
  tag: string | null;
}

export type SpecFuncInfo = {
  name: string;
  normalizedName: string;
  htmlId: string;
  isBuiltIn: boolean;
  isClo: boolean;
  isCont: boolean;
  isMethod: boolean;
  isSdo: boolean;
  sdoInfo: SdoInfo | null;
  methodInfo: [string, string] | null;
};

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
};

export type Version = {
  spec: SpecVersion;
  esmeta: string | null;
  client: string;
};
