import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "@/store";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  heap: st.irState.heap,
});
export const connector = connect(mapStateToProps);
export type HeapViewerProps = ConnectedProps<typeof connector>;
