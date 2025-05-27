import "@/styles/AlgoViewer.css";
import { useEffect, useMemo, useRef } from "react";
import { emit } from "@/utils";
import type { ListNode, OrderedListNode, FragmentNode } from "ecmarkdown";
import { twJoin } from "tailwind-merge";
import { isSameStep } from "./algo.util";
import { BreakpointType, Context } from "@/types";
import { atoms, useAtomValue } from "@/atoms";

// algo steps prefix
interface AlgoStepPrefixProps {
  stringifiedSteps: string;
}

function AlgoStepPrefix({ stringifiedSteps }: AlgoStepPrefixProps) {
  const steps = useMemo(() => JSON.parse(stringifiedSteps) as number[], [stringifiedSteps]);
  const callStack = useAtomValue(atoms.state.callstackAtom);
  const contextIdx = useAtomValue(atoms.state.contextIdxAtom);
  const breakpoints = useAtomValue(atoms.bp.bpAtom);
  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const context: Context | undefined = callStack[contextIdx];
  const irFunc = irFuncs[context.fid];

  const breakedStepsList: number[][] = useMemo(
    () =>
      context === undefined
        ? []
        : (breakpoints
            .map(bp => {
              if (
                bp.type === BreakpointType.Spec &&
                bp.algoName === irFunc.info?.name
              )
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
    <div className="algo-step-prefix" data-this-step={stringifiedSteps}>
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
  scrollOnHighlight: boolean;
}

export default function AlgoStepList({
  listNode,
  stringifiedSteps,
  currentSteps,
  isExit,
  showOnlyVisited,
  visitedStepList,
  scrollOnHighlight,
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
            scrollOnHighlight={scrollOnHighlight}
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
  scrollOnHighlight: boolean;
}

function AlgoStep({
  stringifiedSteps,
  currentSteps,
  isExit,
  contents,
  sublist,
  showOnlyVisited,
  visitedStepList,
  scrollOnHighlight,
}: AlgoStepProps) {
  const ref = useRef<HTMLLIElement>(null);
  const highlightVisited = useAtomValue(atoms.app.highlightVisitedAtom);

  const steps = useMemo(
    () => JSON.parse(stringifiedSteps) as number[],
    [stringifiedSteps],
  );

  const highlight = useMemo(
    () => isSameStep(steps, currentSteps),
    [steps, currentSteps],
  );

  const visited = useMemo(
    () => visitedStepList.some(vss => isSameStep(vss, steps)),
    [steps, visitedStepList],
  );

  const shouldHide = showOnlyVisited && !visited && !highlight;

  const className = useMemo(
    () =>
      twJoin([
        "algo-step",
        highlight && isExit ? "exit-highlight" : highlight ? "highlight" : "",
        !highlight && highlightVisited && visited ? "visited" : "",
        shouldHide ? "hidden" : "",
      ]),
    [highlight, highlightVisited, visited, showOnlyVisited, isExit, shouldHide],
  );

  const emitted = useMemo(() => emit(contents), [contents]);

  useEffect(() => {
    if (scrollOnHighlight && highlight) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      }); 
    }

  }, [highlight]);

  return (
    <>
      {!shouldHide && <AlgoStepPrefix stringifiedSteps={stringifiedSteps} />}
      <li
        ref={ref}
      // AlgoStepCore
      className={twJoin(
        "hover:bg-neutral-400/10 active:bg-neutral-400/20 transition-all cursor-pointer scroll-m-8",
        className,
      )}
      data-this-step={stringifiedSteps}
    >
      {emitted}
    </li>
      {sublist === null || sublist.name === "ul" ? null : (
        <AlgoStepList
          listNode={sublist}
          stringifiedSteps={stringifiedSteps}
          isExit={isExit}
          currentSteps={currentSteps}
          showOnlyVisited={showOnlyVisited}
          visitedStepList={visitedStepList}
          scrollOnHighlight={scrollOnHighlight}
        />
      )}
    </>
  );
}
