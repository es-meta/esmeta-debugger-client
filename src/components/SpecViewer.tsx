import React from "react";
import { Typography, Paper } from "@material-ui/core";
import AlgoViewer from "./AlgoViewer";
import "../styles/SpecViewer.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "../store";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  spec: st.spec,
  irState: st.irState,
});
const connector = connect(mapStateToProps);
type SpecViewerProps = ConnectedProps<typeof connector>;

class SpecViewer extends React.Component<SpecViewerProps> {
  // render() {
  //   return <div className="algo-container">TODO...</div>;
  // }
  render() {
    const { irState, spec } = this.props;
    const context = irState.callStack[irState.contextIdx];
    const steps = context === undefined ? [] : context.steps;

    return (
      <Paper className="spec-viewer-container" variant="outlined">
        <Typography variant="h6">ECMAScript Specification</Typography>
        {/*<div>{JSON.stringify(spec.algorithm)}</div>*/}
        <AlgoViewer algorithm={spec.algorithm} steps={steps} />
      </Paper>
    );
  }
}

export default connector(SpecViewer);
