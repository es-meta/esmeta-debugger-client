import { combineReducers } from "redux";
import appState from "./AppState";
import js from "./JS";
import webDebugger from "./Debugger";
import irState from "./IrState";
import breakpoint from "./Breakpoint";
import spec from "./Spec";
import client from "./Client";

export default combineReducers({
  appState,
  js,
  webDebugger,
  breakpoint,
  irState,
  spec,
  client,
});
