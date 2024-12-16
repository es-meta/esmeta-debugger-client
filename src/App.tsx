import React from "react";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SpecViewer from "./components/SpecViewer";
import Toolbar from "./components/Toolbar";
import StateViewer from "./components/StateViewer";
import JSEditor from "./components/JSEditor";
import "./styles/App.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "./store";
import { AppState } from "./store/reducers/AppState";
import { updateAlgoListRequest } from "./store/reducers/Spec";


const theme = createTheme();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme : unknown) => {
  root: {
    // some CSS that accesses the theme
  }
});

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
class App extends React.Component<AppProps> {
  componentDidMount() {
    if (this.props.appState === AppState.INIT)
      this.props.updateAlgoListRequest();
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderSuccess() {
    return (
      <ThemeProvider theme={theme}>
      <div>
        <ToastContainer autoClose={3000} hideProgressBar={true} />
        <Grid container className="app-container">
          <Grid item xs={12}>
            <Toolbar />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} style={{ width: "100%" }}>
              <Grid
                container
                item
                xs={9}
                spacing={2}
                style={{ padding: "0px 24px" }}
              >
                <Grid item xs={6}>
                  <JSEditor />
                </Grid>
                <Grid item xs={6}>
                  <SpecViewer />
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <StateViewer />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </div>
      </ThemeProvider>
    );
  }

  render() {
    if (this.props.appState === AppState.INIT) return this.renderLoading();
    else return this.renderSuccess();
  }
}

export default connector(App);
