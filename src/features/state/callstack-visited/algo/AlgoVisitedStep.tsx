import React, { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import {
  Emitter,
  // FragmentNode
} from "@/util/ecmarkdown";
import type { ListNode, OrderedListNode, FragmentNode } from "ecmarkdown";
import { twJoin } from "tailwind-merge";
import "@/styles/AlgoViewer.css";

// util
function isSameStep(steps1: number[], steps2: number[]) {
  return (
    // check reference equality
    steps1 === steps2 ||
    (steps1.length === steps2.length &&
      steps1.every((s, idx) => s === steps2[idx]))
  );
}

// algo steps prefix
type AlgoStepPrefixProps = {
  steps: number[];
  breakedStepsList: number[][];
  onPrefixClick: (steps: number[]) => void;
};

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
type AlgoStepProps = {
  contents: FragmentNode[];
  sublist: ListNode | null;
  steps: number[];
  currentSteps: number[];
  breakedStepsList: number[][];
  visitedStepList: number[][];
  onPrefixClick: (steps: number[]) => void;
  level: number;
  idxSelf: number;
};

export const AlgoVisitedStepList = (props: {
  listNode: OrderedListNode;
  steps: number[];
  currentSteps: number[];
  breakedStepsList: number[][];
  visitedStepList: number[][];
  onPrefixClick: (steps: number[]) => void;
  level: number;
}) => {
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
        console.log(props.steps.join(","), a);
        return (
          <AlgoStep
            key={
              a
              // `${props.steps.join(',')}`
            }
            contents={listItemNode.contents}
            sublist={listItemNode.sublist}
            steps={props.steps.concat([idx + 1])}
            currentSteps={props.currentSteps}
            breakedStepsList={props.breakedStepsList}
            visitedStepList={props.visitedStepList}
            onPrefixClick={props.onPrefixClick}
            level={(props.level + 1) % 3}
            idxSelf={idx + 1}
          />
        );
      })}
    </ol>
  );
};

// algorithm steps
function AlgoStep(props: AlgoStepProps) {
  const { steps, currentSteps } = props;
  const { contents, breakedStepsList, onPrefixClick, sublist, level, idxSelf } =
    props;

  // const currentSteps = useMemo(getCurrentSteps, [getCurrentSteps]);

  const visited = useMemo(
    () =>
      props.visitedStepList.some(visitedSteps =>
        isSameStep(visitedSteps, steps),
      ),
    [props.visitedStepList, steps],
  );

  const visiting = useMemo(
    () => isSameStep(steps, currentSteps),
    [steps, currentSteps],
  );

  const className = useMemo((): string => {
    let className = "algo-step";
    if (visiting) className += " highlight ";
    // if (visited) className += " bg-neutral-300 ";
    // if (!visiting && !visited) className += " hidden ";
    return className;
  }, [visited, props.visitedStepList, visiting]);

  const handleClick = useCallback(() => {
    setTimeout(() => onPrefixClick(steps), 0);
  }, [onPrefixClick, steps]);

  return (
    <>
      {visited || visiting && <AlgoStepPrefix
        steps={steps}
        breakedStepsList={breakedStepsList}
        onPrefixClick={onPrefixClick}
      />}
      {visited || visiting ? (
        <AlgoStepCore
          className={className}
          contents={contents}
          handleClick={handleClick}
          value={idxSelf}
        />
      ) : null}
      {visited ? (
        sublist === null || sublist.name === "ul" ? null : (
          <AlgoVisitedStepList
            listNode={sublist}
            steps={steps}
            currentSteps={currentSteps}
            breakedStepsList={breakedStepsList}
            visitedStepList={props.visitedStepList}
            onPrefixClick={onPrefixClick}
            level={level}
          />
        )
      ) : null}
    </>
  );
}

interface CoreProps {
  className: string;
  contents: FragmentNode[];
  handleClick: () => void;
  value: number;
}

function AlgoStepCore({ className, contents, handleClick, value }: CoreProps) {
  return (
    <li
      className={twJoin(
        className,
        "hover:scale-[1.015625] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer",
        "text-black",
      )}
      onClick={handleClick}
      value={value}
    >
      {Emitter.emit(contents)}
    </li>
  );
}
