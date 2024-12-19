import React from "react";
import { v4 as uuid } from "uuid";
import { Emitter, FragmentNode } from "../util/ecmarkdown";
import { parseAlgorithm } from "ecmarkdown";
import type { AlgorithmNode, ListNode, OrderedListNode } from "ecmarkdown";
import { Algorithm } from "../store/reducers/Spec";
import "../styles/AlgoViewer.css";

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
};

const renderListNode = (
  listNode: OrderedListNode,
  steps: number[],
  getCurrentSteps: () => number[],
  getBreakedStepsList: () => number[][],
  onPrefixClick: (steps: number[]) => void,
) => {
  return (
    <ol>
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
          />
        );
      })}
    </ol>
  );
};

// algorithm steps
class AlgoStep extends React.Component<AlgoStepProps> {
  getClassName(): string {
    let className = "algo-step";
    const { steps, getCurrentSteps } = this.props;
    const currentSteps = getCurrentSteps();
    const highlight = isSameStep(steps, currentSteps);
    if (highlight) className += " highlight";
    return className;
  }

  renderSublist() {
    const {
      sublist,
      steps,
      getCurrentSteps,
      getBreakedStepsList,
      onPrefixClick,
    } = this.props;
    if (sublist === null || sublist.name === "ul") return <></>;
    return renderListNode(
      sublist,
      steps,
      getCurrentSteps,
      getBreakedStepsList,
      onPrefixClick,
    );
  }

  render() {
    const { contents, steps, getBreakedStepsList, onPrefixClick } = this.props;

    return (
      <>
        <AlgoStepPrefix
          steps={steps}
          getBreakedStepsList={getBreakedStepsList}
          onPrefixClick={onPrefixClick}
        />
        <li className={this.getClassName()} style={{ color: "black" }}>
          {Emitter.emit(contents)}
        </li>
        {this.renderSublist()}
      </>
    );
  }
}

type AlgoViewerProps = {
  algorithm: Algorithm;
  currentSteps: number[];
  breakedStepsList: number[][];
  onPrefixClick: (fid: number, algoName: string, steps: number[]) => void;
};
class AlgoViewer extends React.Component<AlgoViewerProps> {
  renderHeader() {
    const { algorithm } = this.props;
    return (
      // typography
      <span className="font-600 text-lg">
        <b>{algorithm.name}</b>
        &nbsp;
        <span className="algo-parameters">
          (
          {algorithm.params
            .map(({ name, optional }) => {
              return optional ? name + "?" : name;
            })
            .join(", ")}
          )
        </span>
      </span>
    );
  }

  renderBody(parsed: AlgorithmNode) {
    const getCurrentSteps = () => this.props.currentSteps;
    const getBreakedStepsList = () => this.props.breakedStepsList;
    const { fid, name } = this.props.algorithm;
    const onPrefixClick = (steps: number[]) =>
      this.props.onPrefixClick(fid, name, steps);
    return renderListNode(
      parsed.contents,
      [],
      getCurrentSteps,
      getBreakedStepsList,
      onPrefixClick,
    );
  }

  render() {
    const { algorithm } = this.props;
    const parsed = parseAlgorithm(algorithm.code);

    // render
    return (
      <div className="algo-container">
        {this.renderHeader()}
        {this.renderBody(parsed)}
      </div>
    );
  }
}

export default AlgoViewer;
