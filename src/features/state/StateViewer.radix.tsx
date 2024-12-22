import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";

import { AppState } from "@/store/reducers/AppState";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  disableStateViewer: !(
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});
export const connector = connect(mapStateToProps, mapDispatchToProps);
export type StateViewerProps = ConnectedProps<typeof connector>;
