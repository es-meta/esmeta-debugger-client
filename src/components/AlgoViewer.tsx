import React from "react";
import { v4 as uuid } from "uuid";
import { Typography } from "@material-ui/core";
import { Emitter, FragmentNode } from "../util/ecmarkdown";
import { parseAlgorithm } from "ecmarkdown";
import type { AlgorithmNode, ListNode, OrderedListNode } from "ecmarkdown";
import { Algorithm } from "../store/reducers/Spec";
import "../styles/AlgoViewer.css";

type AlgoStepProps = {
  contents: FragmentNode[];
  sublist: ListNode | null;
  depth: number;
  idx: number;
  steps: number[];
};

const renderListNode = (
  listNode: OrderedListNode,
  steps: number[],
  depth = 0,
) => {
  return (
    <ol>
      {listNode.contents.map((listItemNode, idx) => {
        return (
          <AlgoStep
            key={uuid()}
            contents={listItemNode.contents}
            sublist={listItemNode.sublist}
            depth={depth}
            idx={idx}
            steps={steps}
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
    const { idx, steps } = this.props;
    const highlight = steps.length === 1 && steps[0] === idx + 1;
    if (highlight) className += " highlight";
    return className;
  }

  renderSublist() {
    const { sublist, steps, depth, idx } = this.props;
    if (sublist === null || sublist.name === "ul") return <></>;
    const nextSteps = steps[0] === idx + 1 ? steps.slice(1) : [];
    return renderListNode(sublist, nextSteps, depth + 1);
  }

  render() {
    const { contents } = this.props;

    return (
      <>
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
  steps: number[];
};
class AlgoViewer extends React.Component<AlgoViewerProps> {
  // TODO
  renderFail() {
    return <Typography variant="subtitle1">TODO...</Typography>;
  }

  renderHeader() {
    const { algorithm } = this.props;
    return (
      <Typography variant="subtitle1">
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
      </Typography>
    );
  }

  renderBody(parsed: AlgorithmNode) {
    const { steps } = this.props;
    return renderListNode(parsed.contents, steps);
  }

  render() {
    const { algorithm } = this.props;
    if (algorithm.code === "") return this.renderFail();
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
