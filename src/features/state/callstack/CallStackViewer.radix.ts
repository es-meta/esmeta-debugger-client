import { connect, ConnectedProps } from "react-redux";
import { Context, updateContextIdx } from "@/store/reducers/IrState";
import { ReduxState, Dispatch } from "@/store";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  irState: st.irState,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateContextIdx: (idx: number) => dispatch(updateContextIdx(idx)),
});
export const connector = connect(mapStateToProps, mapDispatchToProps);
export type CallStackViewerProps = ConnectedProps<typeof connector>;
