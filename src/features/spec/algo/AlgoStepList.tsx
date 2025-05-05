import { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { emit } from "@/utils";
import type { ListNode, OrderedListNode, FragmentNode } from "ecmarkdown";
import { twJoin } from "tailwind-merge";
import "@/styles/AlgoViewer.css";
import { isSameStep } from "./algo.util";

// algo steps prefix
interface AlgoStepPrefixProps {
  steps: number[];
  breakedStepsList: number[][];
  onPrefixClick: (steps: number[]) => void;
}

function AlgoStepPrefix(props: AlgoStepPrefixProps) {
  const { breakedStepsList, steps, onPrefixClick } = props;
  const isBreaked = breakedStepsList.some(breakedSteps =>
    isSameStep(steps, breakedSteps),
  );
  return (
    <div className="algo-step-prefix" onClick={() => onPrefixClick(steps)}>
      {isBreaked ? "\u25CF" : "\u00A0"}
    </div>
  );
}

// algo steps
interface AlgoStepProps {
  contents: FragmentNode[];
  sublist: ListNode | null;
  steps: number[];
  currentSteps: number[];
  isExit: boolean;
  breakedStepsList: number[][];
  visitedStepList: number[][];
  onPrefixClick: (steps: number[]) => void;
  level: number;
}

export default function AlgoStepList(props: {
  listNode: OrderedListNode;
  steps: number[];
  currentSteps: number[];
  isExit: boolean;
  breakedStepsList: number[][];
  visitedStepList: number[][];
  onPrefixClick: (steps: number[]) => void;
  level: number;
}) {
  return (
    <ol
      className={twJoin(
        props.level % 3 === 0 && "list-decimal",
        props.level % 3 === 1 && "list-[lower-alpha]",
        props.level % 3 === 2 && "list-[lower-roman]",
        "list-inside",
      )}
    >
      {props.listNode.contents.map((listItemNode, idx) => {
        const a = uuid();
        return (
          <AlgoStep
            key={
              a
              // `${props.steps.join(',')}`
            }
            contents={listItemNode.contents}
            sublist={listItemNode.sublist}
            steps={props.steps.concat([idx + 1])}
            isExit={props.isExit}
            currentSteps={props.currentSteps}
            breakedStepsList={props.breakedStepsList}
            visitedStepList={props.visitedStepList}
            onPrefixClick={props.onPrefixClick}
            level={(props.level + 1) % 3}
          />
        );
      })}
    </ol>
  );
}

// algorithm steps
function AlgoStep(props: AlgoStepProps) {
  const { steps, currentSteps, isExit } = props;
  const { contents, breakedStepsList, onPrefixClick } = props;
  const { sublist } = props;
  const { level } = props;

  // const currentSteps = useMemo(getCurrentSteps, [getCurrentSteps]);

  const className = useMemo((): string => {
    let className = "algo-step";
    const highlight = isSameStep(steps, currentSteps);
    const visited = props.visitedStepList.some(visitedSteps =>
      isSameStep(visitedSteps, steps),
    );
    if (highlight && isExit) className += " exit-highlight";
    else if (highlight) className += " highlight";
    if (!highlight && visited) className += " visited";
    return className;
  }, [steps, currentSteps, props.visitedStepList]);

  const handleClick = useCallback(() => {
    setTimeout(() => onPrefixClick(steps), 0);
  }, [onPrefixClick, steps]);

  return (
    <>
      <AlgoStepPrefix
        steps={steps}
        breakedStepsList={breakedStepsList}
        onPrefixClick={onPrefixClick}
      />
      <AlgoStepCore
        className={className}
        contents={contents}
        handleClick={handleClick}
      />
      {sublist === null || sublist.name === "ul" ? null : (
        <AlgoStepList
          listNode={sublist}
          steps={steps}
          isExit={isExit}
          currentSteps={currentSteps}
          breakedStepsList={breakedStepsList}
          visitedStepList={props.visitedStepList}
          onPrefixClick={onPrefixClick}
          level={level}
        />
      )}
    </>
  );
}

interface CoreProps {
  className: string;
  contents: FragmentNode[];
  handleClick: () => void;
}

function AlgoStepCore({ className, contents, handleClick }: CoreProps) {
  return (
    <li
      className={twJoin(
        className,
        "hover:scale-[1.015625] hover:bg-neutral-400/20 active:scale-95 transition-all cursor-pointer",
      )}
      onClick={handleClick}
    >
      {emit(contents)}
    </li>
  );
}
