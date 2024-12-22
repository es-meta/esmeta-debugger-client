import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { edit } from "@/store/reducers/JS";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  js: st.js,
  appState: st.appState.state,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  edit: (code: string) => dispatch(edit(code)),
});

export const connector = connect(mapStateToProps, mapDispatchToProps);
export type JSEditorProps = ConnectedProps<typeof connector>;
