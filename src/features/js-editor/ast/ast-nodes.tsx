import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import { NodeData } from "@/types";
import "@xyflow/react/dist/style.css";
import { atoms, useAtomValue } from "@/atoms";

export function shouldHighlight(
  [markerStart, markerEnd]: [number, number],
  astRange: [number, number] | undefined,
): "exact" | "descendants" | "ancestors" | undefined {
  const [astStart, astEnd] = astRange ?? [-1, -1];
  if (
    markerStart === -1 ||
    markerEnd === -1 ||
    astStart === -1 ||
    astEnd === -1
  ) {
    return undefined;
  }
  const exact = markerStart === astStart && astEnd === markerEnd;
  const ancestors = markerStart >= astStart && astEnd >= markerEnd;
  const descendants = markerStart <= astStart && astEnd <= markerEnd;

  return exact
    ? "exact"
    : descendants
      ? "descendants"
      : ancestors
        ? "ancestors"
        : undefined;
}

const CLASSNAME = `w-[256px] h-fit py-4 pl-2 dark:bg-neutral-900
  data-[highlight=exact]:bg-yellow-400 data-[highlight=ancestors]:bg-yellow-50 data-[highlight=descendants]:bg-yellow-200
  data-[highlight=exact]:dark:bg-yellow-600 data-[highlight=ancestors]:dark:bg-yellow-950  data-[highlight=descendants]:dark:bg-yellow-800
  rounded-lg border-2 border-neutral-300 dark:border-neutral-700 transition-colors
  `;

export const nodeTypes = {
  syntactic: memo(({ data }: { data: NodeData }) => {
    const jsRange = useAtomValue(atoms.state.currentJSRangeWithFallbackAtom);
    const { Syntactic } = data.ast;
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div
          data-highlight={shouldHighlight(jsRange, Syntactic?.loc)}
          className={CLASSNAME}
        >
          <div className="line-clamp-1 font-serif">{Syntactic?.name} :</div>
          <div className="space-x-1 line-clamp-1">
            {Syntactic?.prodInfo.map(({ type, value }) => (
              <span
                data-prod-type={type}
                key={value}
                className="data-[prod-type=terminal]:font-mono data-[prod-type=nonterminal]:font-serif"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </>
    );
  }),
  lexical: memo(({ data }: { data: NodeData }) => {
    const jsRange = useAtomValue(atoms.state.currentJSRangeWithFallbackAtom);
    const { Lexical } = data.ast;
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div
          data-highlight={shouldHighlight(jsRange, Lexical?.loc)}
          className={CLASSNAME}
        >
          <div className="line-clamp-1 font-serif">{Lexical?.name}</div>
          <div className="font-mono">{Lexical?.str}</div>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </>
    );
  }),
};
