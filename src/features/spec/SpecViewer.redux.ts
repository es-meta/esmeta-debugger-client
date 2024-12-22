import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { Breakpoint, addBreak, rmBreak } from "@/store/reducers/Breakpoint";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  spec: st.spec,
  irState: st.irState,
  breakpoints: st.breakpoint.items,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addBreak: (bp: Breakpoint) => dispatch(addBreak(bp)),
  rmBreak: (opt: string | number) => dispatch(rmBreak(opt)),
});
export const connector = connect(mapStateToProps, mapDispatchToProps);
export type SpecViewerProps = ConnectedProps<typeof connector>;
