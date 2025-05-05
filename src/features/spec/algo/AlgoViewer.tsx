import { BreakpointType, Context } from "@/types";
import React, { useCallback, useMemo } from "react";
import { parseAlgorithm } from "ecmarkdown";
// import { Algorithm } from "@/store/reducers/Spec";
import AlgoStepList from "./AlgoStepList";
import "@/styles/AlgoViewer.css";
import { addBreak, rmBreak } from "@/store/reducers/breapoint";
import AlgoViewerHeader from "./AlgoViewerHeader";
import { useAppDispatch, useAppSelector } from "@/hooks";

type AlgoViewerProps = { context: Context; showOnlyVisited: boolean };

export default function ContextAlgoViewer({
  context,
  showOnlyVisited,
}: AlgoViewerProps) {
  const dispatch = useAppDispatch();

  const breakpoints = useAppSelector(st => st.breakpoint.items);

  const algo = context.algo;

  const currentSteps = useMemo(
    () => (context === undefined ? [] : context.steps) satisfies number[],
    [context],
  );

  const onPrefixClick = useCallback(
    (fid: number, algoName: string, steps: number[]) => {
      // find index of breakpoints
      const bpIdx = breakpoints.findIndex(bp => {
        if (bp.type === BreakpointType.Spec) {
          return (
            bp.fid === fid &&
            bp.steps.length === steps.length &&
            bp.steps.every((s, idx) => s === steps[idx])
          );
        } else return false;
      });

      // remove breakpoints
      if (bpIdx !== -1) dispatch(rmBreak(bpIdx));
      else {
        const bpName = `${steps} @ ${algoName}`;
        dispatch(
          addBreak({
            type: BreakpointType.Spec,
            fid,
            duplicateCheckId: bpName,
            name: algoName,
            steps,
            enabled: true,
          }),
        );
      }
    },
    [breakpoints, dispatch],
  );

  const handleClick: React.MouseEventHandler<Element> = useCallback(
    e => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const stringified = target.dataset.thisStep;
      if (stringified === undefined) return;
      const steps = JSON.parse(stringified) as number[];
      onPrefixClick(algo.fid, algo.name, steps);
    },
    [onPrefixClick, algo.fid, algo.name],
  );

  const empty = useMemo(() => JSON.stringify([]), []);

  const parsed = useMemo(() => parseAlgorithm(algo.code), [algo.code]);

  if (
    context === undefined ||
    context.algo === undefined ||
    context.algo.code.trim() === ""
  ) {
    throw new Error("Algorithm not found");
  }

  return (
    <div className="algo-container w-full h-fit" onClick={handleClick}>
      <AlgoViewerHeader algorithm={algo} />
      <AlgoStepList
        listNode={parsed.contents}
        stringifiedSteps={empty}
        currentSteps={currentSteps}
        isExit={context.isExit}
        showOnlyVisited={showOnlyVisited}
        visitedStepList={context.visited}
      />
    </div>
  );
}
