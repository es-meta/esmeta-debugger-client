import React from "react";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "./store";
import { AppState } from "./store/reducers/AppState";
import { updateAlgoListRequest } from "./store/reducers/Spec";
import Header from "@/components/custom/Header";
import Footer from "@/components/custom/Footer";
import DebuggerApp from "@/features/DebuggerApp";


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

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="min-h-dvh bg-neutral-50">
          <ToastContainer autoClose={3000} hideProgressBar={true} />
          <Header />
          <DebuggerApp />
          <Footer />
        </div>
      </ThemeProvider>
    );
  }
}

export default connector(App);
