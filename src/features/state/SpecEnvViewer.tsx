import React from "react";
import EnvViewer from "./EnvViewer";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "@/store";
import { Environment } from "@/store/reducers/IrState";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  irState: st.irState,
});
const connector = connect(mapStateToProps);
type SpecEnvViewerProps = ConnectedProps<typeof connector>;

class SpecEnvViewer extends React.Component<SpecEnvViewerProps> {
  render() {
    const { callStack, contextIdx } = this.props.irState;
    const env: Environment =
      callStack.length > 0 ? callStack[contextIdx].env : [];
    return <EnvViewer env={env} />;
  }
}

export default connector(SpecEnvViewer);
