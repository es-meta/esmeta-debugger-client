import React, { useCallback, useMemo, useRef } from "react";
import { v4 as uuid } from "uuid";
import { Emitter, FragmentNode } from "@/util/ecmarkdown";
import type { ListNode, OrderedListNode } from "ecmarkdown";
import { twJoin } from "tailwind-merge";
import "@/styles/AlgoViewer.css";
import { toast } from "react-toastify";

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
  getBreakedStepsList: () => number[][];
  onPrefixClick: (steps: number[]) => void;
};
class AlgoStepPrefix extends React.Component<AlgoStepPrefixProps> {
  render() {
    const { getBreakedStepsList, steps, onPrefixClick } = this.props;
    const isBreaked = getBreakedStepsList().some(breakedSteps =>
      isSameStep(steps, breakedSteps),
    );
    return (
      <div className="algo-step-prefix" onClick={() => onPrefixClick(steps)}>
        {isBreaked ? "\u25CF" : "\u00A0"}
      </div>
    );
  }
}

// algo steps
type AlgoStepProps = {
  contents: FragmentNode[];
  sublist: ListNode | null;
  steps: number[];
  getCurrentSteps: () => number[];
  getBreakedStepsList: () => number[][];
  onPrefixClick: (steps: number[]) => void;
  level: number;
};

export const renderListNode = (
  listNode: OrderedListNode,
  steps: number[],
  getCurrentSteps: () => number[],
  getBreakedStepsList: () => number[][],
  onPrefixClick: (steps: number[]) => void,
  level: number,
) => {
  return (
    <ol className={twJoin(
      level % 3 === 0 && "list-decimal",
      level % 3 === 1 && "list-[lower-alpha]",
      level % 3 === 2 && "list-[lower-roman]",
      "list-inside"
    )}>
      {listNode.contents.map((listItemNode, idx) => {
        return (
          <AlgoStep
            key={uuid()}
            contents={listItemNode.contents}
            sublist={listItemNode.sublist}
            steps={steps.concat([idx + 1])}
            getCurrentSteps={getCurrentSteps}
            getBreakedStepsList={getBreakedStepsList}
            onPrefixClick={onPrefixClick}
            level={(level + 1) % 3}
          />
        );
      })}
    </ol>
  );
};

// algorithm steps
function AlgoStep(props: AlgoStepProps) {
  const { steps, getCurrentSteps } = props;
  const { contents, getBreakedStepsList, onPrefixClick } = props;
  const { sublist } = props;
  const { level } = props;

  const currentSteps = useMemo(getCurrentSteps, [getCurrentSteps]);

  const className = useMemo((): string => {
    let className = "algo-step";
    const highlight = isSameStep(steps, currentSteps);
    if (highlight) className += " highlight";
    return className;
  }, [steps, currentSteps]);

  const renderSublist = useCallback(() => {
    if (sublist === null || sublist.name === "ul") return <></>;
    return renderListNode(
      sublist,
      steps,
      getCurrentSteps,
      getBreakedStepsList,
      onPrefixClick,
      level,
    );
  }, [sublist, steps, getCurrentSteps, getBreakedStepsList, onPrefixClick]);

  const handleClick = useCallback(() => {
    setTimeout(() => onPrefixClick(steps), 0);
  }, [onPrefixClick, steps]);

  return (
    <>
      <AlgoStepPrefix
        steps={steps}
        getBreakedStepsList={getBreakedStepsList}
        onPrefixClick={onPrefixClick}
      />
      <AlgoStepCore
        className={className}
        contents={contents}
        handleClick={handleClick}
      />
      {renderSublist()}
    </>
  );
}

interface CoreProps {
  className: string;
  contents: FragmentNode[];
  handleClick: () => void;
}

export function AlgoStepCore({ className, contents, handleClick }: CoreProps) {
    return (
      <li
        className={twJoin(
          className,
          "hover:scale-[0.98] hover:bg-neutral-100 active:scale-[0.94] transition-all cursor-pointer",
          "text-black",
        )}
        onClick={handleClick}
      >
        {Emitter.emit(contents)}
      </li>
    );
};