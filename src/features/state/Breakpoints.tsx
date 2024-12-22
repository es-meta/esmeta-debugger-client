import React, { Suspense, useDeferredValue, useMemo } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import "@/styles/Breakpoints.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "../../store";
import {
  Breakpoint,
  BreakpointType,
  addBreak,
  rmBreak,
  toggleBreak,
} from "../../store/reducers/Breakpoint";

type BreakpointItemProp = {
  data: Breakpoint;
  idx: number;
  onRemoveClick: (idx: number) => void;
  onToggleClick: (idx: number) => void;
};

class BreakpointItem extends React.Component<BreakpointItemProp> {
  onToggleClick() {
    const { idx, onToggleClick } = this.props;
    onToggleClick(idx);
  }
  onRemoveClick() {
    const { idx, onRemoveClick } = this.props;
    onRemoveClick(idx);
  }
  render() {
    const { data } = this.props;
    const { name, enabled } = data;
    return (
      <tr>
        <th style={{ width: "50%", overflow: "hidden" }}>
          {/* <Tooltip title={name}>
            <span>{name}</span>
          </Tooltip> */}
          {name}
        </th>
        <th style={{ width: "15%" }}>
          <MySwitch checked={enabled} onChange={() => this.onToggleClick()} />
        </th>
        <th style={{ width: "15%" }}>
          <button onClick={() => this.onRemoveClick()}>
            <XIcon />
          </button>
        </th>
      </tr>
    );
  }
}

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  breakpoints: st.breakpoint.items,
  algos: st.spec.nameMap,
  algoNames: Object.getOwnPropertyNames(st.spec.nameMap).sort(),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addBreak: (bp: Breakpoint) => dispatch(addBreak(bp)),
  rmBreak: (opt: string | number) => dispatch(rmBreak(opt)),
  toggleBreak: (opt: string | number) => dispatch(toggleBreak(opt)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type BreakpointsProps = ConnectedProps<typeof connector>;
type BreakpointsState = { algoName: string; query: string };

// TODO add util buttons
// delete all
// disable all
// sort
class Breakpoints extends React.Component<BreakpointsProps, BreakpointsState> {
  constructor(props: BreakpointsProps) {
    super(props);
    this.state = { algoName: "", query: "" };
  }

  onAddChange(algoName: string) {
    this.setState({ ...this.state, algoName });
  }
  onAddClick() {
    const algoName = this.state.algoName;
    const steps: number[] = [1];

    const bpName = `${steps} @ ${algoName}`;
    const duplicated = this.props.breakpoints.some(
      ({ name }) => name === bpName,
    );
    const valid = this.props.algos.hasOwnProperty(algoName);
    if (valid && !duplicated)
      this.props.addBreak({
        type: BreakpointType.Spec,
        fid: this.props.algos[algoName],
        name: bpName,
        steps: steps,
        enabled: true,
      });
    else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
    else toast.warning(`Wrong algorithm name: ${algoName}`);
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      this.onAddClick();
    }
  };

  render() {
    const { breakpoints, algoNames } = this.props;
    const { algoName, query } = this.state;

    return (
      <div className="breakpoints-container">
        <MyCombobox
          algoName={algoName}
          algoNames={algoNames}
          onChange={s => this.onAddChange(s)}
        />
              <button
        style={{ padding: 0 }}
        onClick={() => this.onAddClick()}
        >
          <PlusIcon />
      </button>

        {algoName}

        {/* <Autocomplete
          freeSolo
          disableClearable
          options={algoNames}
          onChange={(_, value) => this.onAddChange(value)}
          renderInput={params => (
            <TextField
              {...params}
              label="Algorithm Name"
              variant="outlined"
              size="small"
              value={algoName}
              margin="normal"
              InputProps={{
                ...params.InputProps,
                type: "search",
                endAdornment: (
                  <IconButton
                    style={{ padding: 0 }}
                    onClick={() => this.onAddClick()}
                  >
                    <Icon>add_circle</Icon>
                  </IconButton>
                ),
              }}
              onKeyDown={e => this.onKeyDown(e)}
              onChange={event => this.onAddChange(event.target.value)}
            />
          )}
        /> */}
        <div
          className="breakpoints-table-container"
        >
          <table>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Name</th>
                <th style={{ width: "15%" }}>Enable</th>
                <th style={{ width: "15%" }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {breakpoints.map((bp, idx) => (
                <BreakpointItem
                  key={uuid()}
                  data={bp}
                  idx={idx}
                  onRemoveClick={(idx: number) => this.props.rmBreak(idx)}
                  onToggleClick={(idx: number) => this.props.toggleBreak(idx)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connector(Breakpoints);

import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { fuzzyFilter } from "@/util/fuzzy.util";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";
import MySwitch from "@/components/button/MySwitch";

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
