import React from "react";
import { Grid } from "@mui/material";

import SpecViewer from "./SpecViewer";
import Toolbar from "./Toolbar";
import StateViewer from "./StateViewer";
import JSEditor from "./JSEditor";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { updateAlgoListRequest } from "@/store/reducers/Spec";

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
        <div className="sticky top-0 flex flex-row z-50 bg-white gap-4">
          <h1>Debugger</h1>
          <div>editor</div>
          <div>spec viewer</div>
          <div>tools</div>
          <div></div>
        </div>
        
      <Grid container spacing={2} columns={{ xs: 6, sm: 12, md: 18, lg: 32 }}
        className="w-full justify-center items-start relative">
        <Grid item xs={6}>
        <Toolbar />
        </Grid>
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
