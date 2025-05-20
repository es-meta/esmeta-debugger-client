import type { AST, NodeData } from "@/types";
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/react";
import { NODE_HEIGHT, NODE_WIDTH } from "./constant";

type PositionedAST = {
  node: AST;
  x: number;
  y: number;
  children: PositionedAST[];
};

type TreeNode = {
  ast: AST;
  children: TreeNode[];
  x: number;
  y: number;
  mod: number;
  thread?: TreeNode;
  ancestor: TreeNode;
  change: number;
  shift: number;
  number: number;
  parent: TreeNode | null;
};

function buildTree(
  ast: AST,
  depth = 0,
  parent: TreeNode | null = null,
  number = 1,
): TreeNode {
  const children: AST[] =
    ast.Syntactic?.children.filter((c: AST | null): c is AST => c !== null) ??
    [];
  const node: TreeNode = {
    ast,
    children: [],
    x: 0,
    y: depth * NODE_HEIGHT,
    mod: 0,
    ancestor: null as any,
    change: 0,
    shift: 0,
    number,
    parent,
  };
  node.ancestor = node;

  node.children = children.map((child, i) =>
    buildTree(child, depth + 1, node, i + 1),
  );

  return node;
}

function firstWalk(v: TreeNode): void {
  if (v.children.length === 0) {
    if (leftSibling(v)) {
      v.x = leftSibling(v)!.x + NODE_WIDTH;
    } else {
      v.x = 0;
    }
  } else {
    let defaultAncestor = v.children[0];
    for (const w of v.children) {
      firstWalk(w);
      defaultAncestor = apportion(w, defaultAncestor);
    }

    executeShifts(v);

    const midpoint =
      (v.children[0].x + v.children[v.children.length - 1].x) / 2;
    const left = leftSibling(v);
    if (left) {
      v.x = left.x + NODE_WIDTH;
      v.mod = v.x - midpoint;
    } else {
      v.x = midpoint;
    }
  }
}

function apportion(v: TreeNode, defaultAncestor: TreeNode): TreeNode {
  const w = leftSibling(v);
  if (!w) return defaultAncestor;

  let vip = v;
  let vop = v;
  let vim = w;
  let vom = leftMostSibling(v);

  let sip = vip.mod;
  let sop = vop.mod;
  let sim = vim.mod;
  let som = vom.mod;

  while (nextRight(vim) && nextLeft(vip)) {
    vim = nextRight(vim)!;
    vip = nextLeft(vip)!;
    vom = nextLeft(vom)!;
    vop = nextRight(vop)!;

    const shift = vim.x + sim - (vip.x + sip) + NODE_WIDTH;
    if (shift > 0) {
      moveSubtree(ancestor(vim, v, defaultAncestor), v, shift);
      sip += shift;
      sop += shift;
    }

    sim += vim.mod;
    sip += vip.mod;
    som += vom.mod;
    sop += vop.mod;
  }

  if (nextRight(vim) && !nextRight(vop)) {
    vop.thread = nextRight(vim);
    vop.mod += sim - sop;
  }
  if (nextLeft(vip) && !nextLeft(vom)) {
    vom.thread = nextLeft(vip);
    vom.mod += sip - som;
  }

  return defaultAncestor;
}

function moveSubtree(wl: TreeNode, wr: TreeNode, shift: number): void {
  const subtrees = wr.number - wl.number;
  wr.change -= shift / subtrees;
  wr.shift += shift;
  wl.change += shift / subtrees;
  wr.x += shift;
  wr.mod += shift;
}

function executeShifts(v: TreeNode): void {
  let shift = 0;
  let change = 0;
  for (let i = v.children.length - 1; i >= 0; i--) {
    const w = v.children[i];
    w.x += shift;
    w.mod += shift;
    change += w.change;
    shift += w.shift + change;
  }
}

function secondWalk(v: TreeNode, m = 0): void {
  v.x += m;
  for (const w of v.children) {
    secondWalk(w, m + v.mod);
  }
}

function ancestor(
  vim: TreeNode,
  v: TreeNode,
  defaultAncestor: TreeNode,
): TreeNode {
  return v.parent!.children.includes(vim.ancestor)
    ? vim.ancestor
    : defaultAncestor;
}

function leftMostSibling(v: TreeNode): TreeNode {
  return v.parent!.children[0];
}

function nextLeft(v: TreeNode): TreeNode | undefined {
  return v.children.length > 0 ? v.children[0] : v.thread;
}

function nextRight(v: TreeNode): TreeNode | undefined {
  return v.children.length > 0 ? v.children[v.children.length - 1] : v.thread;
}

function leftSibling(v: TreeNode): TreeNode | null {
  if (!v.parent) return null;
  const index = v.parent.children.indexOf(v);
  return index > 0 ? v.parent.children[index - 1] : null;
}

function convertToPositioned(v: TreeNode): PositionedAST {
  return {
    node: v.ast,
    x: v.x,
    y: v.y,
    children: v.children.map(convertToPositioned),
  };
}

/** 정렬된 트리 생성기 */
export function layoutAST(ast: AST): PositionedAST {
  const tree = buildTree(ast);
  firstWalk(tree);
  secondWalk(tree);
  return convertToPositioned(tree);
}

export function positionedTreeToFlowElements(root: PositionedAST): {
  nodes: FlowNode<NodeData>[];
  edges: FlowEdge<NodeData>[];
} {
  const nodes: FlowNode<NodeData>[] = [];
  const edges: FlowEdge<NodeData>[] = [];

  let idCounter = 0;

  function walk(node: PositionedAST, parentId: string | null = null): string {
    const id = String(idCounter++);

    const label = node.node.Syntactic
      ? node.node.Syntactic.name
      : `${node.node.Lexical!.str} : ${node.node.Lexical!.name}`;

    const type = node.node.Syntactic ? "syntactic" : "lexical";

    nodes.push({
      id,
      position: { x: node.x, y: node.y },
      data: {
        label,
        ast: node.node,
        index: 0,
        depth: node.y,
      },
      type,
    });

    if (parentId !== null) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
      });
    }

    for (const child of node.children) {
      walk(child, id);
    }

    return id;
  }

  walk(root);
  return { nodes, edges };
}

export function astToFlowReingoldTilfordBuchheim(ast: AST) {
  const positionedTree = layoutAST(ast);
  return positionedTreeToFlowElements(positionedTree);
}
