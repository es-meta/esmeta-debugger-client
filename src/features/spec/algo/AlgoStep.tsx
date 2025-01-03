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
    steps1.length === steps2.length &&
    steps1.every((s, idx) => s === steps2[idx])
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
  onPrefixClick: (steps: number[]) => void;
  level: number;
};

export const AlgoStepList = (props: {
  listNode: OrderedListNode;
  steps: number[];
  currentSteps: number[];
  breakedStepsList: number[][];
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
        return (
          <AlgoStep
            key={uuid()}
            contents={listItemNode.contents}
            sublist={listItemNode.sublist}
            steps={props.steps.concat([idx + 1])}
            currentSteps={props.currentSteps}
            breakedStepsList={props.breakedStepsList}
            onPrefixClick={props.onPrefixClick}
            level={(props.level + 1) % 3}
          />
        );
      })}
    </ol>
  );
};

// algorithm steps
function AlgoStep(props: AlgoStepProps) {
  const { steps, currentSteps } = props;
  const { contents, breakedStepsList, onPrefixClick } = props;
  const { sublist } = props;
  const { level } = props;

  // const currentSteps = useMemo(getCurrentSteps, [getCurrentSteps]);

  const className = useMemo((): string => {
    let className = "algo-step";
    const highlight = isSameStep(steps, currentSteps);
    if (highlight) className += " highlight";
    return className;
  }, [steps, currentSteps]);

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
          currentSteps={currentSteps}
          breakedStepsList={breakedStepsList}
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

const AlgoStepCore = React.memo(
  function AlgoStepCore({ className, contents, handleClick }: CoreProps) {
    return (
      <li
        className={twJoin(
          className,
          "hover:scale-[1.015625] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer",
          "text-black",
        )}
        onClick={handleClick}
      >
        {Emitter.emit(contents)}
      </li>
    );
  },
  (prev, next) => prev.contents === next.contents,
);
