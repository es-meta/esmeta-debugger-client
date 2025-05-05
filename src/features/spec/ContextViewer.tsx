import { lazy } from "react";
import type { Algorithm, Context } from "@/types";

const ContextAlgoViewer = lazy(() => import("./algo/AlgoViewer"));
const Graphviz = lazy(() => import("./Graphviz"));

type Props = DisjointBooleanFlag<"embed" | "full"> & {
  context: Context | undefined;
};

export function ContextViewer({ context, embed }: Props) {
  const isEmbeded = embed ?? false;
  const algo: Algorithm | undefined = context?.algo;

  if (context === undefined || algo === undefined || algo.fid === -1) {
    return isEmbeded ? null : (
      <div className="grow overflow-y-scroll">
        <aside className="text-center py-4">
          Please write JavaScript code and press the run button.
        </aside>
      </div>
    );
  }

  if (algo.code.trim() === "") {
    return isEmbeded ? (
      <aside className="text-center py-4">
        This context does not have an algorithm code.
      </aside>
    ) : (
      <Graphviz dot={algo.code} />
    );
  }

  return <ContextAlgoViewer showOnlyVisited={isEmbeded} context={context} />;
}
