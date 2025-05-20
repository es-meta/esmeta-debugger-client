import { AST } from "../../../types/ast.types";

// 트리 압축: 자신의 자식이 정확히 1개이고, 자신의 손자가 정확히 1개인 경우 손자를 가져옴
export function compress<TreeNode>(
  node: TreeNode,
  getChildren: (t: TreeNode) => TreeNode[],
  changeChildren: (t: TreeNode, children: TreeNode[]) => TreeNode,
): TreeNode {
  let self = node;

  while (true) {
    const childrenInitial = getChildren(self);
    if (childrenInitial.length === 1) {
      const grandChildren = getChildren(childrenInitial[0]);
      if (grandChildren.length === 1) {
        self = changeChildren(self, grandChildren);
        continue;
      }
    }
    break;
  }

  const compressed = getChildren(self);
  const newChildren = compressed.map(child =>
    compress(child, getChildren, changeChildren),
  );

  return changeChildren(self, newChildren);
}

// 트리 압축: 자신의 자식이 정확히 1개인 경우 자식을 가져옴. 단, 내 children
export function compressShallow<TreeNode>(
  node: TreeNode,
  getChildren: (t: Readonly<TreeNode>) => TreeNode[],
  changeChildren: (
    t: Readonly<TreeNode>,
    children: Readonly<TreeNode[]>,
  ) => TreeNode,
  doesContainTerminal: (t: Readonly<TreeNode>) => boolean,
): TreeNode {
  let self: TreeNode = node;

  while (true) {
    const childrenInitial = getChildren(self);
    if (childrenInitial.length === 1 && !doesContainTerminal(self)) {
      self = childrenInitial[0];
      continue;
    }
    break;
  }

  const compressed = getChildren(self);
  const newChildren = compressed
    .filter(c => c !== null)
    .map(child =>
      compressShallow(child, getChildren, changeChildren, doesContainTerminal),
    );

  return changeChildren(self, newChildren);
}

export function compressAST(ast: AST): AST {
  return compress<AST>(
    ast,
    t => (t.Syntactic?.children ?? []).filter(c => c !== null),
    (t, children) => {
      if (t.Syntactic) {
        return {
          ...t,
          Syntactic: {
            ...t.Syntactic,
            children,
          },
        };
      }
      return t;
    },
  );
}

export function compressASTShallow(ast: Readonly<AST>): AST {
  return compressShallow<AST>(
    ast,
    t => (t.Syntactic?.children ?? []).filter(c => c !== null),
    (t, children) => {
      const newT = structuredClone(t);
      if (newT.Syntactic) {
        return {
          ...newT,
          Syntactic: {
            ...newT.Syntactic,
            children: structuredClone(children) as AST[],
          },
        };
      }
      return newT;
    },
    t => {
      return t.Syntactic?.prodInfo.some(p => p.type === "terminal") ?? false;
    },
  );
}
