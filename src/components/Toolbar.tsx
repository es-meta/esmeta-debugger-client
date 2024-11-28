import React, { useCallback, useEffect, useState } from "react";
import { Button, ButtonGroup, Step } from "@mui/material";
import "../styles/Toolbar.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "../store";

import { AppState } from "../store/reducers/AppState";
import {
  run,
  stop,
  specStep,
  specStepOut,
  specStepOver,
  jsStep,
  jsStepOut,
  jsStepOver,
  specContinue,
} from "../store/reducers/Debugger";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  disableRun: st.appState.state !== AppState.JS_INPUT,
  disableDebuggerBtn: st.appState.state !== AppState.DEBUG_READY,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  run: () => dispatch(run()),
  stop: () => dispatch(stop()),
  specStep: () => dispatch(specStep()),
  specStepOut: () => dispatch(specStepOut()),
  specStepOver: () => dispatch(specStepOver()),
  jsStep: () => dispatch(jsStep()),
  jsStepOut: () => dispatch(jsStepOut()),
  jsStepOver: () => dispatch(jsStepOver()),
  specContinue: () => dispatch(specContinue()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type ToolbarProps = ConnectedProps<typeof connector>;

function Toolbar(props: ToolbarProps) {
  const handleKeyPress = useCallback((event) => {
    /*
      prevent handleKeyPress called while adding breakpoints
     */
    const focusedElement = document.activeElement;
    if(focusedElement && (focusedElement.tagName==="INPUT" || focusedElement.tagName==="TEXTAREA")) {
      return;
    }

    switch (event.key) {
      case 'r':
        run()
        break
      case 'a':
        stop()
        break
      case 's':
        specStep()
        break
      case 'o':
        specStepOver()
        break
      case 'u':
        specStepOut()
        break
      case 'j':
        jsStep()
        break
      case 'v':
        jsStepOver()
        break
      case 't':
        jsStepOut()
        break
      case 'c':
        specContinue()
        break
      case 'Escape':
        break
      default:
        console.log(`other: ${event.key}`)
    }
  }, [focus]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

    const {
      specContinue,
      disableRun,
      disableDebuggerBtn,
      run,
      stop,
      specStep,
      specStepOver,
      specStepOut,
      jsStep,
      jsStepOver,
      jsStepOut,
    } = props;

  const emphasize = { color: 'black', fontWeight: 'bold' };
    return (
      <div className="toolbar-container" tabIndex={0}>
        <ButtonGroup variant="text" color="primary">
          <Button disabled={disableRun} onClick={() => run()}>
            <span style={emphasize}>R</span>
            <span>un</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => stop()}>
            <span>C</span>
            <span style={emphasize}>a</span>
            <span>ncel</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => specStep()}>
            <span style={emphasize}>S</span>
            <span>tep</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => specStepOver()}>
            <span>Step-</span>
            <span style={emphasize}>O</span>
            <span>ver</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => specStepOut()}>
            <span>Step-O</span>
            <span style={emphasize}>u</span>
            <span>t</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => jsStep()}>
            <span style={emphasize}>J</span>
            <span>s-Step</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => jsStepOver()}>
            <span>Js-Step-O</span>
            <span style={emphasize}>v</span>
            <span>er</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => jsStepOut()}>
            <span>Js-Step-Ou</span>
            <span style={emphasize}>t</span>
          </Button>
          <Button disabled={disableDebuggerBtn} onClick={() => specContinue()}>
            <span style={emphasize}>C</span>
            <span>ontinue</span>
          </Button>
        </ButtonGroup>
      </div>
    );
}

export default connector(Toolbar);
