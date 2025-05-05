import "@/styles/AlgoViewer.css";
import { useMemo } from "react";
import { emit } from "@/utils";
import type { ListNode, OrderedListNode, FragmentNode } from "ecmarkdown";
import { twJoin } from "tailwind-merge";
import { isSameStep } from "./algo.util";
import { shallowEqual, useAppSelector } from "@/hooks";
import { BreakpointType, Context } from "@/types";
import { atoms, useAtomValue } from "@/atoms";

// algo steps prefix
interface AlgoStepPrefixProps {
  stringifiedSteps: string;
}

function AlgoStepPrefix({ stringifiedSteps }: AlgoStepPrefixProps) {
  const steps = JSON.parse(stringifiedSteps) as number[];
  const { breakpoints, callStack, contextIdx } = useAppSelector(
    st => ({
      breakpoints: st.breakpoint.items,
      callStack: st.ir.callStack,
      contextIdx: st.ir.contextIdx,
    }),
    shallowEqual,
  );

  const context: Context | undefined = callStack[contextIdx];

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

  const isBreaked = breakedStepsList.some(breakedSteps =>
    isSameStep(steps, breakedSteps),
  );
  return (
    <div className="algo-step-prefix" data-this-step={JSON.stringify(steps)}>
      {isBreaked ? "\u25CF" : "\u00A0"}
    </div>
  );
}

interface AlgoStepListProps {
  listNode: OrderedListNode;
  stringifiedSteps: string;
  currentSteps: number[];
  isExit: boolean;
  showOnlyVisited?: boolean;
  visitedStepList: number[][];
}

export default function AlgoStepList({
  listNode,
  stringifiedSteps,
  currentSteps,
  isExit,
  showOnlyVisited,
  visitedStepList,
}: AlgoStepListProps) {
  const steps = JSON.parse(stringifiedSteps) as number[];
  return (
    <ol>
      {listNode.contents.map((listItemNode, idx) => {
        return (
          <AlgoStep
            contents={listItemNode.contents}
            sublist={listItemNode.sublist}
            stringifiedSteps={JSON.stringify(steps.concat([idx + 1]))}
            isExit={isExit}
            currentSteps={currentSteps}
            showOnlyVisited={showOnlyVisited}
            visitedStepList={visitedStepList}
          />
        );
      })}
    </ol>
  );
}

// algo steps
interface AlgoStepProps {
  contents: FragmentNode[];
  sublist: ListNode | null;
  stringifiedSteps: string;
  currentSteps: number[];
  isExit: boolean;
  showOnlyVisited?: boolean;
  visitedStepList: number[][];
}

function AlgoStep({
  stringifiedSteps,
  currentSteps,
  isExit,
  contents,
  sublist,
  showOnlyVisited,
  visitedStepList,
}: AlgoStepProps) {
  const steps = JSON.parse(stringifiedSteps) as number[];
  const highlightVisitedAtom = useAtomValue(atoms.app.highlightVisitedAtom);

  const className = useMemo((): string => {
    let className = "algo-step";
    const highlight = isSameStep(steps, currentSteps);
    const visited = visitedStepList.some(visitedSteps =>
      isSameStep(visitedSteps, steps),
    );
    if (highlight && isExit) className += " exit-highlight";
    else if (highlight) className += " highlight";
    if (!highlight && highlightVisitedAtom && visited) className += " visited";
    if (showOnlyVisited && !visited && !highlight) className += " hidden";
    return className;
  }, [steps, currentSteps, highlightVisitedAtom, visitedStepList]);

  return (
    <>
      <AlgoStepPrefix stringifiedSteps={stringifiedSteps} />
      <AlgoStepCore
        className={className}
        contents={contents}
        stringifiedStep={stringifiedSteps}
      />
      {sublist === null || sublist.name === "ul" ? null : (
        <AlgoStepList
          listNode={sublist}
          stringifiedSteps={stringifiedSteps}
          isExit={isExit}
          currentSteps={currentSteps}
          showOnlyVisited={showOnlyVisited}
          visitedStepList={visitedStepList}
        />
      )}
    </>
  );
}

interface CoreProps {
  className: string;
  contents: FragmentNode[];
  stringifiedStep?: string;
}

function AlgoStepCore({ className, contents, stringifiedStep }: CoreProps) {
  const emitted = useMemo(() => emit(contents), [contents]);
  return (
    <li
      className={twJoin(
        "hover:scale-[1.015625] hover:bg-neutral-400/20 active:scale-[0.99] transition-all cursor-pointer",
        className,
      )}
      data-this-step={stringifiedStep}
    >
      {emitted}
    </li>
  );
}
