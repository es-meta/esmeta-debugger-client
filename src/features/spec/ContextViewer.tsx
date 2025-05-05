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
        <p className="text-neutral-500 dark:text-neutral-400 p-2">
          Please write JavaScript code and press the run button.
        </p>
      </div>
    );
  }

  if (algo.code.trim() === "") {
    return isEmbeded ? (
      <p className="text-neutral-500 dark:text-neutral-400 p-2">
        This context does not have an algorithm code.
      </p>
    ) : (
      <Graphviz dot={algo.code} />
    );
  }

  return <ContextAlgoViewer showOnlyVisited={isEmbeded} context={context} />;
}
