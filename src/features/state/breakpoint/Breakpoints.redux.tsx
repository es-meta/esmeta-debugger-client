import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import {
  Breakpoint,
  addBreak,
  rmBreak,
  toggleBreak,
} from "@/store/reducers/Breakpoint";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  breakpoints: st.breakpoint.items,
  algos: st.spec.nameMap,
  algoNames: Object.getOwnPropertyNames(st.spec.nameMap).sort(),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addBreak: (bp: Breakpoint) => dispatch(addBreak(bp)),
  rmBreak: (opt: string | number) => dispatch(rmBreak(opt)),
  toggleBreak: (opt: string | number) => dispatch(toggleBreak(opt)),
});
export const connector = connect(mapStateToProps, mapDispatchToProps);
export type BreakpointsProps = ConnectedProps<typeof connector>;
