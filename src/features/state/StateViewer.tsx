import React from "react";
import "@/styles/StateViewer.css";

import CallStackViewer from "./CallStackViewer";
import HeapViewer from "./HeapViewer";
import Breakpoints from "./Breakpoints";
import SpecEnvViewer from "./SpecEnvViewer";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";

import { AppState } from "@/store/reducers/AppState";
import { twJoin } from "tailwind-merge";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

// State viewer item
type StateViewerItemProps = {
  disabled: boolean;
  header: string;
  headerStyle?: React.CSSProperties;
  body: React.ReactElement;
  bodyStyle?: React.CSSProperties;
};
type StateViewerItemState = {
  expanded: boolean;
};
class StateViewerItem extends React.Component<
  StateViewerItemProps,
  StateViewerItemState
> {
  constructor(props: StateViewerItemProps) {
    super(props);
    this.state = { expanded: false };
  }
  componentDidUpdate(prev: StateViewerItemProps) {
    // close accordian when diasabled
    if (!prev.disabled && this.props.disabled)
      this.setState({ ...this.state, expanded: false });
  }
  onItemClick() {
    const { disabled } = this.props;
    if (!disabled) {
      const expanded = !this.state.expanded;
      this.setState({ ...this.state, expanded });
    }
  }
  render() {
    const { disabled, header, headerStyle, body, bodyStyle } = this.props;
    return (
      <Card>
        <CardHeader title={header}/>
        <div style={bodyStyle}>{body}</div>
      </Card>
    );
  }
}

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  disableStateViewer: !(
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type StateViewerProps = ConnectedProps<typeof connector>;

class StateViewer extends React.Component<StateViewerProps> {
  render() {
    const { disableStateViewer } = this.props;

    return (
      <div className="spec-state-viewer-container">
        <StateViewerItem
          disabled={disableStateViewer}
          header="ECMAScript Call Stack"
          body={<CallStackViewer />}
        />
        <StateViewerItem
          disabled={disableStateViewer}
          header="ECMAScript Environment"
          body={<SpecEnvViewer />}
        />
        <StateViewerItem
          disabled={disableStateViewer}
          header="ECMAScript Heap"
          bodyStyle={{ paddingTop: 0 }}
          body={<HeapViewer />}
        />
        <StateViewerItem
          disabled={disableStateViewer}
          header="ECMAScript Breakpoints"
          body={<Breakpoints />}
        />
      </div>
    );
  }
}

export default connector(StateViewer);
