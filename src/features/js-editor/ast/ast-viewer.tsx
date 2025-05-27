import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node as FlowNode,
  Edge as FlowEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
  ControlButton,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { atom, useAtom, useAtomValue } from "jotai";
import { compressASTShallow } from "./utils";

import { astToFlowReingoldTilfordBuchheim } from "./reignold-tilford-buchheim";
import { atoms } from "@/atoms";
import {
  nodeTypes,
  shouldHighlight,
} from "./ast-nodes";
import { NodeData } from "@/types";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

const astReingoldTilfordBuchheimAtom = atom(get => {
  const ast = get(atoms.state.astAtom);
  if (!ast) return null;
  const { nodes, edges } = astToFlowReingoldTilfordBuchheim(ast);
  return { nodes, edges };
});

const astCompressedReingoldTilfordBuchheimAtom = atom(get => {
  const ast = get(atoms.state.astAtom);
  if (!ast) return null;
  const { nodes, edges } = astToFlowReingoldTilfordBuchheim(
    compressASTShallow(ast),
  );
  return { nodes, edges };
});

const compressedAtom = atom(true);

export default function App() {
  const [compressed, setCompressed] = useAtom(compressedAtom);
  const ref = useRef<ReactFlowInstance<
    FlowNode<NodeData>,
    FlowEdge<NodeData>
  > | null>(null);

  const transformedCompressedAst = useAtomValue(
    astCompressedReingoldTilfordBuchheimAtom,
  );

  const transformedAst = useAtomValue(astReingoldTilfordBuchheimAtom);

  const jsRange = useAtomValue(atoms.state.currentJSRangeWithFallbackAtom);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode<NodeData>>(
    [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge<NodeData>>(
    [],
  );

  useEffect(() => {
    if (!compressed) {
      if (transformedAst) {
        // positionedTreeToFlowElements(layoutAST
        setNodes([...transformedAst.nodes]);
        setEdges([...transformedAst.edges]);
      } else {
        setNodes([]);
        setEdges([]);
      }
    }
  }, [compressed, transformedAst, setNodes, setEdges]);

  useEffect(() => {
    if (compressed) {
      if (transformedCompressedAst) {
        // positionedTreeToFlowElements(layoutAST
        setNodes([...transformedCompressedAst.nodes]);
        setEdges([...transformedCompressedAst.edges]);
      } else {
        setNodes([]);
        setEdges([]);
      }
    }
  }, [compressed, transformedCompressedAst, setNodes, setEdges]);

  const highlightTargets = useMemo(() => {
    return JSON.stringify(
      nodes
        .filter(node => {
          const res = shouldHighlight(
            jsRange,
            node.data.ast.Syntactic?.loc ?? node.data.ast.Lexical?.loc,
          );
          return res === "exact" || res === "descendants";
        })
        .map(node => node.id),
    );
  }, [nodes, jsRange]);

  const fitToHighlight = useCallback(() => {
    const [start, end] = jsRange;
    if (ref.current && start !== -1 && end !== -1) {
      const parsed = JSON.parse(highlightTargets);
      ref.current.fitView({
        nodes: nodes.filter(node => parsed.includes(node.id)),
        duration: DURATION,
        padding: PADDING,
      });
    } else {
      setTimeout(() => {
        ref.current?.fitView({
          duration: DURATION,
          padding: PADDING,
        });
      });
    }
  }, [highlightTargets, jsRange]);

  useEffect(() => {
    setTimeout(() => {
      fitToHighlight();
    }, 1);
  }, [fitToHighlight]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode="system"
        minZoom={0.0625} // 최대한 축소
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={instance => {
          ref.current = instance;
        }}
        nodesDraggable={false}
        edgesFocusable={false}
        edgesReconnectable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        nodeTypes={nodeTypes}
        onlyRenderVisibleElements
      >
        <Controls>
          <ControlButton
            onClick={() => setCompressed(c => !c)}
            title={compressed ? "Expand AST" : "Compress AST"}
          >
            {compressed ? <ChevronsUpDownIcon /> : <ChevronsDownUpIcon />}
          </ControlButton>
        </Controls>
        {nodes.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500">
            No AST to display.
          </div>
        )}
        <MiniMap zoomable pannable />
        <Background variant={BackgroundVariant.Dots} gap={16} size={0} />
      </ReactFlow>
    </div>
  );
}

const DURATION = 500;
const PADDING = 0.1;
