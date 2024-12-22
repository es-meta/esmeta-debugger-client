import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "@/store";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  irState: st.irState,
});
export const connector = connect(mapStateToProps);
export type SpecEnvViewerProps = ConnectedProps<typeof connector>;
