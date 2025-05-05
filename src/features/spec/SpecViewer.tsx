import { lazy, Suspense } from "react";

import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

import { BookMarkedIcon } from "lucide-react";
import { shallowEqual, useAppSelector } from "@/hooks";
import type { Algorithm } from "@/types";

const AlgoViewer = lazy(() => import("./algo/AlgoViewer"));
const Graphviz = lazy(() => import("./Graphviz"));

// view type of spec
enum SpecViewType {
  GRAPH,
  ALGORITHM,
  DEFAULT,
}

export default function SpecViewer() {
  const { callStack, contextIdx } = useAppSelector(
    st => ({ callStack: st.ir.callStack, contextIdx: st.ir.contextIdx }),
    shallowEqual,
  );
  const algo: Algorithm | undefined = callStack[contextIdx]?.algo;

  const viewType: SpecViewType =
    algo === undefined || algo.fid === -1
      ? SpecViewType.DEFAULT
      : algo.code === ""
        ? SpecViewType.GRAPH
        : SpecViewType.ALGORITHM;

  if (viewType === SpecViewType.DEFAULT) {
    return (
      <Card className="size-full flex flex-col">
        <CardHeader
          title="ECMAScript Specification"
          icon={<BookMarkedIcon size={14} className="inline" />}
        />
        <div className="grow overflow-y-scroll">
          <p className="text-neutral-500 dark:text-neutral-400 p-2">
            Please write JavaScript code and press the run button.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="size-full flex flex-col">
      <CardHeader
        title="ECMAScript Specification"
        icon={<BookMarkedIcon size={14} className="inline" />}
      />
      <Suspense fallback={null}>
        <div className="grow overflow-y-scroll">
          {viewType === SpecViewType.ALGORITHM ? (
            <Suspense fallback={null}>
              <AlgoViewer />
            </Suspense>
          ) : (
            <Suspense fallback={null}>
              <Graphviz dot={algo.dot} />
            </Suspense>
          )}
        </div>
      </Suspense>
    </Card>
  );
}
