import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

import MyCombobox from "@/components/combobox/MyCombobox";

import { BreakpointType } from "@/store/reducers/Breakpoint";

import { connector, type BreakpointsProps } from "./Breakpoints.redux";
import BreakpointItem from "./BreakpointItem";
import { PlusIcon } from "lucide-react";
import StateViewerItem from "../StateViewerItem";

// TODO add util buttons
// delete all
// disable all
// sort
export default connector(function Breakpoints(props: BreakpointsProps) {
  const { breakpoints, algoNames } = props;
  const [algoName, setAlgoName] = useState<string | null>(null);

  const onAddClick = useCallback(
    (algoName: string | null) => {
      if (algoName === null) {
        setAlgoName(algoName);
        return;
      }

      const steps: number[] = [1];

      const bpName = `${steps} @ ${algoName}`;
      const duplicated = props.breakpoints.some(({ name }) => name === bpName);
      const valid = props.algos.hasOwnProperty(algoName);
      if (valid && !duplicated)
        props.addBreak({
          type: BreakpointType.Spec,
          fid: props.algos[algoName],
          name: bpName,
          steps: steps,
          enabled: true,
        });
      else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
      else toast.warning(`Wrong algorithm name: ${algoName}`);
      setAlgoName(algoName);
    },
    [props.breakpoints, props.algos],
  );

  // const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === "Enter") {
  //     onAddClick();
  //   }
  // }, [onAddClick]);

  return (
    <StateViewerItem header="Breakpoints">
      <div className="flex flex-row items-center w-full">
        <MyCombobox value={algoName} values={algoNames} onChange={onAddClick} />
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th style={{ width: "70%" }}>Name</th>
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
              onRemoveClick={(idx: number) => props.rmBreak(idx)}
              onToggleClick={(idx: number) => props.toggleBreak(idx)}
            />
          ))}
        </tbody>
      </table>
    </StateViewerItem>
  );
});
