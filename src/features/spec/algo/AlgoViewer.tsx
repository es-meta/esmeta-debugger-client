import React from "react";
import { parseAlgorithm } from "ecmarkdown";
import type { AlgorithmNode } from "ecmarkdown";
import { Algorithm } from "@/store/reducers/Spec";
import { renderListNode } from "./AlgoStep";
import "@/styles/AlgoViewer.css";

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
      0,
    );
  }

  render() {
    const { algorithm } = this.props;
    const parsed = parseAlgorithm(algorithm.code);

    // render
    return (
      <div className="algo-container size-fit">
        {this.renderHeader()}
        {this.renderBody(parsed)}
      </div>
    );
  }
}

export default AlgoViewer;
