import React from "react";
import { Grid } from "@mui/material";

import SpecViewer from "./SpecViewer";
import Toolbar from "./toolbar/Toolbar";
import StateViewer from "./StateViewer";
import JSEditor from "./JSEditor";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { updateAlgoListRequest } from "@/store/reducers/Spec";
import ConnectState from "./ConnectState";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  appState: st.appState.state,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateAlgoListRequest: () => dispatch(updateAlgoListRequest()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type AppProps = ConnectedProps<typeof connector>;

// App component
class DebuggerApp extends React.Component<AppProps> {
  componentDidMount() {
    if (this.props.appState === AppState.INIT)
      this.props.updateAlgoListRequest();
  }

  render() {
    return (
      <>
        <ConnectState />
        <Toolbar />
        
      <Grid container spacing={2} columns={{ xs: 6, sm: 12, md: 18, lg: 18 }}
        className="w-full justify-center items-start relative lg:px-24">
        <Grid item xs={6}>
        <JSEditor />
        </Grid>
        <Grid item xs={6}>
        <SpecViewer />
        </Grid>
        <Grid item xs={6}>
        <StateViewer />
        </Grid>
        </Grid>
      </>
    );
  }
}

export default connector(DebuggerApp);
