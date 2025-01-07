import React, { useCallback, useMemo } from "react";
import { parseAlgorithm } from "ecmarkdown";
import { Algorithm } from "@/store/reducers/Spec";
import { AlgoVisitedStepList } from "./AlgoVisitedStep";
import "@/styles/AlgoViewer.css";
import { Breakpoint, BreakpointType } from "@/store/reducers/Breakpoint";
import { addBreak, rmBreak } from "@/store/reducers/Breakpoint";
import { useDispatch } from "react-redux";
import { Context } from "@/store/reducers/IrState";

export function ContextVisitedViewer(props: {
  context: Context;
  algo: Algorithm;
  breakpoints: Breakpoint[];
}) {
  const dispatch = useDispatch();
  const { algo, breakpoints, context } = props;

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
            name: bpName,
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
    <div className="algo-container size-fit">
      <AlgoViewerHeader algorithm={algo} />
      <AlgoVisitedStepList
        listNode={parsed.contents}
        steps={empty}
        currentSteps={currentSteps}
        breakedStepsList={breakedStepsList}
        visitedStepList={context.visited}
        onPrefixClick={handlePrefixClick}
        level={0}
      />
    </div>
  );
}

function AlgoViewerHeader({ algorithm }: { algorithm: Algorithm }) {
  return (
    <div className="font-600 text-lg bg-white">
      <b>{algorithm.name}</b>
      <span className="algo-parameters">
        (
        {algorithm.params
          .map(({ name, optional }) => {
            return optional ? name + "?" : name;
          })
          .join(", ")}
        )
      </span>
    </div>
  );
}
