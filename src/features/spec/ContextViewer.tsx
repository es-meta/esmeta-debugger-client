import { lazy } from "react";
import type { Context, IrFunc } from "@/types";
import { atoms, useAtomValue } from "@/atoms";

const AlgoViewerHeaderUsingAlgoName = lazy(() =>
  import("./algo/AlgoViewerHeader").then(m => ({
    default: m.AlgoViewerHeaderUsingAlgoName,
  })),
);
const AlgoViewer = lazy(() => import("./algo/AlgoViewer"));

type Props = DisjointBooleanFlag<"embed" | "full"> & {
  context: Context | undefined;
};

export function ContextViewer({ context, embed }: Props) {
  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const isEmbeded = embed ?? false;
  const irFunc: IrFunc | undefined =
    context === undefined ? undefined : irFuncs[context.fid];

  if (context === undefined || irFunc === undefined) {
    return isEmbeded ? null : (
      <div className="grow overflow-y-scroll">
        <aside className="text-center py-4">
          Please write JavaScript code and press the run button.
        </aside>
      </div>
    );
  }

  if (irFunc.algoCode.trim() === "") {
    return (
      <div className="algo-container w-full h-fit break-before-column wrap-break-word hyphens-auto">
        <AlgoViewerHeaderUsingAlgoName name={irFunc.name} />
        <aside className="text-center py-4 font-sans">
          This context has no algorithm code because it isn’t taken directly
          from the ECMAScript specification. It is implemented as a
          spec-compliant helper function to model specification language.
        </aside>
      </div>
    );
  }

  return <AlgoViewer showOnlyVisited={isEmbeded} context={context} />;
}
