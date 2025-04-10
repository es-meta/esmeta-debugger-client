import React, { useCallback, useMemo } from "react";
import { parseAlgorithm } from "ecmarkdown";
// import { Algorithm } from "@/store/reducers/Spec";
import AlgoStepList from "./AlgoStepList";
import "@/styles/AlgoViewer.css";
import { BreakpointType } from "@/store/reducers/Breakpoint";
import { SpecViewerProps } from "../SpecViewer.redux";
import { addBreak, rmBreak } from "@/store/reducers/Breakpoint";
import { useDispatch } from "react-redux";
import { Context } from "@/store/reducers/IrState";
import AlgoViewerHeader from "./AlgoViewerHeader";

function ContextViewer(props: SpecViewerProps & { context: Context }) {
  const dispatch = useDispatch();
  const { algo, breakpoints, context, irToSpecMapping } = props;

  const currentSteps = useMemo(
    () => (context === undefined ? [] : context.steps) satisfies number[],
    [context],
  );

  const breakedStepsList: number[][] = useMemo(
    () =>
      context === undefined
        ? []
        : (breakpoints
            .map(bp => {
              if (bp.type === BreakpointType.Spec && bp.fid === context.fid)
                return bp.steps;
              else return undefined;
            })
            .filter(_ => _ !== undefined) as number[][]),
    [context, breakpoints],
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

  const empty = useMemo(() => [], []);

  const parsed = useMemo(() => parseAlgorithm(algo.code), [algo.code]);

  const handlePrefixClick = useCallback(
    (steps: number[]) => onPrefixClick(algo.fid, algo.name, steps),
    [onPrefixClick, algo.fid, algo.name],
  );

  return (
    <div className="algo-container w-full h-fit break-all">
      <AlgoViewerHeader algorithm={algo} irToSpecMapping={irToSpecMapping} />
      <AlgoStepList
        listNode={parsed.contents}
        steps={empty}
        currentSteps={currentSteps}
        isExit={context.isExit}
        breakedStepsList={breakedStepsList}
        visitedStepList={context.visited}
        onPrefixClick={handlePrefixClick}
        level={0}
      />
    </div>
  );
}

export default function AlgoViewer(props: SpecViewerProps) {
  const { irState } = props;

  const context = irState.callStack[irState.contextIdx];

  return <ContextViewer {...props} context={context} />;
}
