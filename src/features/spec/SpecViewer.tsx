import React from "react";
import AlgoViewer from "./algo/AlgoViewer";
import Graphviz from "./Graphviz";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import {
  Breakpoint,
  BreakpointType,
  addBreak,
  rmBreak,
} from "@/store/reducers/Breakpoint";
import SpecViewerMenu from "./SpecViewerMenu";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  spec: st.spec,
  irState: st.irState,
  breakpoints: st.breakpoint.items,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addBreak: (bp: Breakpoint) => dispatch(addBreak(bp)),
  rmBreak: (opt: string | number) => dispatch(rmBreak(opt)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type SpecViewerProps = ConnectedProps<typeof connector>;

class SpecViewer extends React.Component<SpecViewerProps> {
  renderAlgoViewer() {
    const { irState, spec, breakpoints } = this.props;
    const context = irState.callStack[irState.contextIdx];
    const currentSteps = context === undefined ? [] : context.steps;
    const breakedStepsList: number[][] =
      context === undefined
        ? []
        : (breakpoints
            .map(bp => {
              if (bp.type === BreakpointType.Spec && bp.fid === context.fid)
                return bp.steps;
              else return undefined;
            })
            .filter(_ => _ !== undefined) as number[][]);
    const onPrefixClick = (fid: number, algoName: string, steps: number[]) => {
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
      if (bpIdx !== -1) this.props.rmBreak(bpIdx);
      else {
        const bpName = `${steps} @ ${algoName}`;
        this.props.addBreak({
          type: BreakpointType.Spec,
          fid,
          name: bpName,
          steps,
          enabled: true,
        });
      }
    };
    return (
      <AlgoViewer
        algorithm={spec.algorithm}
        currentSteps={currentSteps}
        breakedStepsList={breakedStepsList}
        onPrefixClick={onPrefixClick}
      />
    );
  }

  renderGraphViewer() {
    const dot = this.props.spec.algorithm.dot;
    // const options = { fit: true, zoom: true };
    return <Graphviz className="graphviz-container" dot={dot} options={{}} />;
  }

  renderDefaultViewer() {
    return <p className="px-4">Please write JavaScript code and press the run button.</p>;
  }

  render() {
    const algo = this.props.spec.algorithm;

    // decide which component to view
    let viewType: SpecViewType = SpecViewType.DEFAULT;
    if (algo.fid !== -1) {
      viewType = algo.code === "" ? SpecViewType.GRAPH : SpecViewType.ALGORITHM;
    }

    return (
      <Card>
      <CardHeader title="ECMAScript Specification">
      </CardHeader>
        <div className="size-full overflow-hidden">
          {viewType === SpecViewType.ALGORITHM
            ? this.renderAlgoViewer()
            : viewType === SpecViewType.GRAPH
              ? this.renderGraphViewer()
              : this.renderDefaultViewer()}
        </div>
      </Card>
    );
  }
}

import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

// view type of spec
enum SpecViewType {
  GRAPH,
  ALGORITHM,
  DEFAULT,
}

export default connector(SpecViewer);
