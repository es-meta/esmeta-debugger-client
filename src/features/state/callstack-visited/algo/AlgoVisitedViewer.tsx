import React, { useCallback, useMemo } from "react";
import { parseAlgorithm } from "ecmarkdown";
import { Algorithm, IrToSpecMapping } from "@/store/reducers/Spec";
import { AlgoVisitedStepList } from "./AlgoVisitedStep";
import "@/styles/AlgoViewer.css";
import { Breakpoint, BreakpointType } from "@/store/reducers/Breakpoint";
import { addBreak, rmBreak } from "@/store/reducers/Breakpoint";
import { useDispatch, useSelector } from "react-redux";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";
import { ReduxState } from "@/store";

export function ContextVisitedViewer(props: {
  context: Context;
  algo: Algorithm;
  breakpoints: Breakpoint[];
}) {
  const dispatch = useDispatch();
  const { algo, breakpoints, context } = props;

  const irToSpecMapping = useSelector(
    (st: ReduxState) => st.spec.irToSpecMapping,
  );

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

function AlgoViewerHeader({
  algorithm,
  irToSpecMapping,
}: {
  algorithm: Algorithm;
  irToSpecMapping: IrToSpecMapping;
}) {
  const specInfo = irToSpecMapping[algorithm.name];

  const title = (() => {
    if (specInfo?.sdoInfo && specInfo.isSdo === true) {
      return specInfo.sdoInfo.method;
    }

    if (specInfo?.isBuiltIn === true) {
      return algorithm.name.substring("INTRINSICS.".length);
    }

    if (specInfo?.methodInfo) {
      const [, mn] = specInfo.methodInfo;
      return mn;
    }

    return algorithm.name;
  })();

  const isSdo = specInfo?.isSdo === true;

  const params = (
    specInfo?.isSdo === true || specInfo?.isMethod === true
      ? algorithm.params.slice(1)
      : algorithm.params
  )
    .map(({ name, optional }) => {
      return optional ? name + "?" : name;
    })
    .join(", ");

  const prodInfo = specInfo?.sdoInfo?.prod?.prodInfo;

  return (
    <>
      <div className="pt-2 px-2 font-es font-600 text-lg bg-white">
        <b>{title}</b>
        <span className="algo-parameters">({params})</span>
        {/* <Info algorithm={algorithm} irToSpecMapping={irToSpecMapping} /> */}
      </div>
      {isSdo && (
        <div className="px-2 flex flex-col mb-1 break-all">
          {prodInfo && (
            <p className="ml-4">
              <b className="inline font-300 italic">
                {specInfo.sdoInfo?.prod?.astName}
              </b>
              <b className="inline font-700">&nbsp;:</b>
              {prodInfo.map((prod, idx) => (
                <b
                  key={idx}
                  className={twMerge(
                    "inline",
                    prod.type === "terminal" && "font-700 font-mono text-sm",
                    prod.type === "nonterminal" && "font-300 italic",
                  )}
                >
                  &nbsp;{prod.value}
                </b>
              ))}
            </p>
          )}
        </div>
      )}
      {specInfo?.methodInfo && (
        <div className="px-2 flex flex-col mb-1 break-all">
          <p className="px-2 font-300">
            <b className="size-14 text-[#2aa198] italic font-es">
              {algorithm.params[0].name}
            </b>{" "}
            :{" "}
            <b className="size-14 text-black font-es">
              {specInfo?.methodInfo[0]}
            </b>
          </p>
        </div>
      )}
    </>
  );
}
