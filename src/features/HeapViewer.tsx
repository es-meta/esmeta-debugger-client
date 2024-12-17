import React from "react";
import { TextField } from "@mui/material";
import { Autocomplete } from "@mui/material";
import "../styles/HeapViewer.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "../store";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  heap: st.irState.heap,
});
const connector = connect(mapStateToProps);
type HeapViewerProps = ConnectedProps<typeof connector>;
type HeapViewerState = { searchAddr: string };

class HeapViewer extends React.Component<HeapViewerProps, HeapViewerState> {
  constructor(props: HeapViewerProps) {
    super(props);
    this.state = { searchAddr: "" };
  }
  onTextInput(searchAddr: string) {
    this.setState({ ...this.state, searchAddr });
  }
  renderObj(obj: string | undefined) {
    return obj === undefined ? <span>NOT FOUND</span> : <pre>{obj}</pre>;
  }

  handleCopy = () => {
    const { heap } = this.props;
    const { searchAddr } = this.state;
    const obj = heap[searchAddr];

    // obj가 존재할 때만 클립보드에 복사
    if (obj !== undefined) {
      navigator.clipboard.writeText(obj)
        .then(() => alert("Copied to clipboard!"))
        .catch(err => console.error("Failed to copy: ", err));
    } else {
      alert("Nothing to copy!");
    }
  };

  render() {
    const { heap } = this.props;
    const { searchAddr } = this.state;
    const addrs = Object.keys(heap);
    const obj = heap[searchAddr];
    return (
      <div className="heap-viewer-container">
        <Autocomplete
          freeSolo
          disableClearable
          options={addrs}
          onChange={(_, value) => this.onTextInput(value)}
          renderInput={params => (
            <TextField
              {...params}
              label="Heap Address"
              size="small"
              margin="normal"
              variant="outlined"
              onChange={event => this.onTextInput(event.target.value)}
              value={searchAddr}
              InputProps={{ ...params.InputProps, type: "search" }}
            />
          )}
        />
        <button onClick={this.handleCopy}>copy</button>
        <div className="heap-viewer-obj-wrapper">{this.renderObj(obj)}</div>
      </div>
    );
  }
}

export default connector(HeapViewer);
