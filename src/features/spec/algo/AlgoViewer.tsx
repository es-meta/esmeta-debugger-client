import { Breakpoint, BreakpointType, Context } from "@/types";
import React, { useCallback, useMemo } from "react";
import { parseAlgorithm } from "ecmarkdown";
import AlgoStepList from "./AlgoStepList";
import "@/styles/AlgoViewer.css";
// import { addBreak, rmBreak } from "@/store/reducers/breapoint";
import AlgoViewerHeader from "./AlgoViewerHeader";

import { useAtomValue, atoms, useSetAtom } from "@/atoms";

type AlgoViewerProps = { context: Context; showOnlyVisited: boolean };

export default function AlgoView({
  context,
  showOnlyVisited,
}: AlgoViewerProps) {
  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const breakpoints = useAtomValue(atoms.bp.bpAtom);
  const addBreak = useSetAtom(atoms.bp.addAction);
  const rmBreak = useSetAtom(atoms.bp.rmAction);
  const fid = context.fid;
  const irFunc = irFuncs[fid];
  const currentSteps: number[] = useMemo(() => context?.steps ?? [], [context]);

  const handleClick: React.MouseEventHandler<Element> = useCallback(
    e => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const stringified = target.dataset.thisStep;
      if (stringified === undefined) return;
      const steps = JSON.parse(stringified) as number[];
      onPrefixClick(
        breakpoints,
        addBreak,
        rmBreak,
        irFunc.fid,
        irFunc.name,
        steps,
      );
    },
    [breakpoints, addBreak, rmBreak, irFunc.fid, irFunc.name],
  );

  const parsed = useMemo(
    () => parseAlgorithm(irFunc.algoCode),
    [irFunc.algoCode],
  );

  if (
    context === undefined ||
    irFunc.algoCode === undefined ||
    irFunc.algoCode.trim() === ""
  ) {
    throw new Error("Algorithm not found");
  }

  return (
    <div
      className="algo-container w-full h-fit break-before-column wrap-break-word hyphens-auto"
      onClick={handleClick}
    >
      <AlgoViewerHeader fid={fid} />
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

const empty = JSON.stringify([]);

function onPrefixClick(
  breakpoints: Breakpoint[],
  addBreak: (bp: Breakpoint) => void,
  rmBreak: (bp: number | "all") => void,
  fid: number,
  algoName: string,
  steps: number[],
) {
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
  if (bpIdx !== -1) rmBreak(bpIdx);
  else {
    const bpName = `${steps} @ ${algoName}`;
    addBreak({
      type: BreakpointType.Spec,
      fid,
      duplicateCheckId: bpName,
      name: algoName,
      steps,
      enabled: true,
    });
  }
}
