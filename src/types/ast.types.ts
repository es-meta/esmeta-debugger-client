export type AST = ASTSyntactic | ASTLexical;

export type ASTSyntactic = {
  Syntactic: {
    name: string;
    args: boolean[];
    rhsIdx?: number;
    children: (AST | null)[];
    prodInfo: (
      | {
          type: "terminal";
          value: string;
        }
      | {
          type: "nonterminal";
          value: string;
        }
    )[];
    loc: [number, number];
  };
  Lexical?: undefined;
};

export type ASTLexical = {
  Lexical: {
    name: string;
    str: string;
    loc: [number, number];
  };
  Syntactic?: undefined;
};

export type NodeData = {
  index: number;
  depth: number;
  label: string;
  ast: AST;
};
