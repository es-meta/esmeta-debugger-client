import React from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { Autocomplete } from "@material-ui/lab";
import {
  Tooltip,
  IconButton,
  Icon,
  TextField,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import "../styles/Breakpoints.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "../store";
import {
  Breakpoint,
  addBreak,
  rmBreak,
  toggleBreak,
} from "../store/reducers/Breakpoint";

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
      <TableRow>
        <TableCell style={{ width: "50%", overflow: "hidden" }}>
          <Tooltip title={name}>
            <span>{name}</span>
          </Tooltip>
        </TableCell>
        <TableCell style={{ width: "15%" }}>
          <Switch checked={enabled} onChange={() => this.onToggleClick()} />
        </TableCell>
        <TableCell style={{ width: "15%" }}>
          <IconButton component="span" onClick={() => this.onRemoveClick()}>
            <Icon color="secondary">remove_circle</Icon>
          </IconButton>
        </TableCell>
      </TableRow>
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
type BreakpointsState = { bpName: string };

// TODO add util buttons
// delete all
// disable all
// sort
class Breakpoints extends React.Component<BreakpointsProps, BreakpointsState> {
  constructor(props: BreakpointsProps) {
    super(props);
    this.state = { bpName: "" };
  }

  onAddChange(bpName: string) {
    this.setState({ ...this.state, bpName });
  }
  onAddClick() {
    const bpName = this.state.bpName;
    const duplicated = this.props.breakpoints.some(
      ({ name }) => name === bpName,
    );
    const valid = this.props.algos.hasOwnProperty(bpName);
    if (valid && !duplicated)
      this.props.addBreak({
        fid: this.props.algos[bpName],
        name: bpName,
        // TODO steps: null,
        enabled: true,
      });
    else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
    else toast.warning(`Wrong breakpoint name: ${bpName}`);
  }

  render() {
    const { breakpoints, algoNames } = this.props;
    const { bpName } = this.state;

    return (
      <div className="breakpoints-container">
        <Autocomplete
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
              value={bpName}
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
              onChange={event => this.onAddChange(event.target.value)}
            />
          )}
        />
        <TableContainer
          component={Paper}
          className="breakpoints-table-container"
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "50%" }}>Name</TableCell>
                <TableCell style={{ width: "15%" }}>Enable</TableCell>
                <TableCell style={{ width: "15%" }}>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breakpoints.map((bp, idx) => (
                <BreakpointItem
                  key={uuid()}
                  data={bp}
                  idx={idx}
                  onRemoveClick={(idx: number) => this.props.rmBreak(idx)}
                  onToggleClick={(idx: number) => this.props.toggleBreak(idx)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default connector(Breakpoints);
