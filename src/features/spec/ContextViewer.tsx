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
        <aside className="text-left py-4 font-sans px-2">
          This context contains no algorithmic code because it was not
          automatically compiled from the ECMAScript specification. This is
          likely due to one of the following reasons:
          <ul className="list-disc list-outside [&>li]:ml-4 space-y-4 mt-4">
            <li>
              The algorithm is defined as <b>host-defined</b> or{" "}
              <b>implementation-defined</b>, so ESMeta provides a manually
              modeled IR-level implementation that conforms to the
              specification’s requirements.
            </li>
            <li>
              The content is not written in <b>ecmarkdown</b> but structured as a lookup
              table, and thus was manually modeled as an IR function in ESMeta.
            </li>
            <li>
              It serves as a spec-compliant auxiliary function designed to
              assist in evaluating the specification language.
            </li>
          </ul>
        </aside>
      </div>
    );
  }

  return <AlgoViewer showOnlyVisited={isEmbeded} context={context} scrollOnHighlight={!embed} />;
}
