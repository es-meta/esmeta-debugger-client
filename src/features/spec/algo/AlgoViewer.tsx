import React, { useCallback, useMemo } from "react";
import { parseAlgorithm } from "ecmarkdown";
import { Algorithm } from "@/store/reducers/Spec";
import { AlgoStepList } from "./AlgoStep";
import "@/styles/AlgoViewer.css";
import { BreakpointType } from "@/store/reducers/Breakpoint";
import { SpecViewerProps } from "../SpecViewer.redux";

export default function AlgoViewer(props: SpecViewerProps) {
  const { irState, spec, breakpoints, rmBreak, addBreak } = props;

  const context = irState.callStack[irState.contextIdx];

  const currentSteps = useMemo(
    () => (context === undefined ? [] : context.steps),
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
      if (bpIdx !== -1) rmBreak(bpIdx);
      else {
        const bpName = `${steps} @ ${algoName}`;
        addBreak({
          type: BreakpointType.Spec,
          fid,
          name: bpName,
          steps,
          enabled: true,
        });
      }
    },
    [rmBreak, breakpoints, addBreak],
  );

  const empty = useMemo(() => [], []);

  const parsed = useMemo(
    () => parseAlgorithm(spec.algorithm.code),
    [spec.algorithm.code],
  );

  const handlePrefixClick = useCallback(
    (steps: number[]) =>
      onPrefixClick(spec.algorithm.fid, spec.algorithm.name, steps),
    [onPrefixClick, spec.algorithm.fid, spec.algorithm.name],
  );

  return (
    <div className="algo-container size-fit">
      <AlgoViewerHeader algorithm={spec.algorithm} />
      <AlgoStepList
        listNode={parsed.contents}
        steps={empty}
        currentSteps={currentSteps}
        breakedStepsList={breakedStepsList}
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
      &nbsp;
      <span className="font-mono text-blue-500 underline">
        to ecma 262 spec {"->"}
      </span>
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
