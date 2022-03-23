import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { v4 as uuid } from "uuid";
import "../styles/CallStackViewer.css";

import { connect, ConnectedProps } from "react-redux";
import { Context, updateContextIdx } from "../store/reducers/IrState";
import { ReduxState, Dispatch } from "../store";

type ContextItemProps = {
  data: Context;
  highlight: boolean;
  idx: number;
  onItemClick: (idx: number) => void;
};
class ContextItem extends React.Component<ContextItemProps> {
  getClassName(): string {
    let className = "context-item";
    const { highlight } = this.props;
    if (highlight) className += " highlight";
    return className;
  }
  render() {
    const { data, idx, onItemClick } = this.props;
    const { name, steps } = data;
    // TODO beautify steps
    const content = steps.length === 0 ? name : `${steps} @ ${name}`;

    return (
      <TableRow
        className={this.getClassName()}
        onClick={() => onItemClick(idx)}
      >
        <TableCell style={{ width: "10%" }}>{idx}</TableCell>
        <TableCell style={{ width: "90%" }}>{content}</TableCell>
      </TableRow>
    );
  }
}

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  irState: st.irState,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateContextIdx: (idx: number) => dispatch(updateContextIdx(idx)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type CallStackViewerProps = ConnectedProps<typeof connector>;

class CallStackViewer extends React.Component<CallStackViewerProps> {
  onItemClick(idx: number) {
    this.props.updateContextIdx(idx);
  }
  render() {
    const { callStack, contextIdx } = this.props.irState;

    return (
      <div className="callstack-container">
        <TableContainer component={Paper} className="callstack-table-container">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "10%" }}>#</TableCell>
                <TableCell style={{ width: "90%" }}>name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callStack.map((ctxt, idx) => (
                <ContextItem
                  key={uuid()}
                  data={ctxt}
                  idx={idx}
                  highlight={idx === contextIdx}
                  onItemClick={(idx: number) => this.onItemClick(idx)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default connector(CallStackViewer);
