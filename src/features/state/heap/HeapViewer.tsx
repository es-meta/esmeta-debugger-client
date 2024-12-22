import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "@/store";
import { toast } from "react-toastify";
import MyCombobox from "@/components/combobox/MyCombobox";
import { CopyIcon } from "lucide-react";

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
    toast.info("hi " + searchAddr);
    this.setState({ ...this.state, searchAddr });
  }

  handleCopy = () => {
    const { heap } = this.props;
    const { searchAddr } = this.state;
    const obj = heap[searchAddr];

    // obj가 존재할 때만 클립보드에 복사
    if (obj !== undefined) {
      navigator.clipboard
        .writeText(obj)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(err => toast.error("Failed to copy: ", err));
    } else {
      toast.info("Nothing to copy!");
    }
  };

  render() {
    const { heap } = this.props;
    const { searchAddr } = this.state;
    const addrs = Object.keys(heap);
    const obj = heap[searchAddr];
    return (
      <div className="w-full">
        <MyCombobox
          values={addrs}
          value={searchAddr}
          onChange={s => this.onTextInput(s)}
        />
        <button onClick={this.handleCopy}>
          <CopyIcon />
        </button>
        <pre className="p-4 bg-neutral-200">{obj || "NOT FOUND"}</pre>
      </div>
    );
  }
}

export default connector(HeapViewer);
