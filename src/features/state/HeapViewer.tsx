import React from "react";
import "@/styles/HeapViewer.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from "@/store";

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
    toast.info('hi ' + searchAddr)
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
      navigator.clipboard
        .writeText(obj)
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
        <MyCombobox algoNames={addrs} algoName={searchAddr} onChange={s => this.onTextInput(s)} />
        <button onClick={this.handleCopy}>copy</button>
        <div className="heap-viewer-obj-wrapper">{this.renderObj(obj)}</div>
      </div>
    );
  }
}

export default connector(HeapViewer);


import { useState, useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { fuzzyFilter } from "@/util/fuzzy.util";
import { CheckIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";
import { toast } from "react-toastify";

interface ComboProps {
  algoNames: string[];
  algoName: string;
  onChange: (value: string) => void;
}

function MyCombobox({ algoNames, algoName, onChange }: ComboProps) {
  // const [selectedPerson, setSelectedPerson] = useState(people[0])
  const [query, setQuery] = useState("");

  // const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () =>
      query === ""
        ? algoNames
        : fuzzyFilter(algoNames, query.replace(" ", ""), 0.2),
    [query, algoNames],
  );

  return (
    <Combobox
      immediate
      as="div"
      className="relative"
      virtual={{ options: filtered }}
      value={algoName}
      onChange={value => onChange(value || "")}
    >
      <ComboboxInput
        className="w-full p-2 border rounded-lg focus:border focus:border-blue-300 focus:outline-none"
        onChange={event => setQuery(event.target.value)}
      />

      
      {
      <ComboboxOptions
        transition
        anchor="bottom"
        className="z-[1] w-[var(--input-width)] origin-top border transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 h-32 overflow-scroll bg-white rounded-lg"
      >
        {({ option: name }) => (
          <ComboboxOption key={name} value={name} as={React.Fragment}>
            {({ focus }) => (
              <li
              className={twJoin(
                focus ? "bg-blue-200" : "bg-white",
                "p-2 cursor-pointer",
                "w-full",
              )}
              >
                <CheckIcon className="hidden ui-selected:block" />
                {name}
              </li>
            )}
          </ComboboxOption>
        )}
        </ComboboxOptions>
      }
    </Combobox>
  );
}
