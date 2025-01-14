import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import {
  Breakpoint,
  addBreak,
  rmBreak,
  toggleBreak,
} from "@/store/reducers/Breakpoint";
import { AppState } from "@/store/reducers/AppState";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  breakpoints: st.breakpoint.items,
  algos: st.spec.nameMap,
  algoNames: Object.getOwnPropertyNames(st.spec.nameMap).sort(),
  ignoreBp: st.appState.ignoreBP,
  disableQuit:
    st.appState.state === AppState.INIT ||
    st.appState.state === AppState.JS_INPUT,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addBreak: (bp: Breakpoint) => dispatch(addBreak(bp)),
  rmBreak: (opt: string | number) => dispatch(rmBreak(opt)),
  toggleBreak: (opt: string | number) => dispatch(toggleBreak(opt)),
});
export const connector = connect(mapStateToProps, mapDispatchToProps);
export type BreakpointsProps = ConnectedProps<typeof connector>;
