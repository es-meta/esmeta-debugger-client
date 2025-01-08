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

  return (
    <StateViewerItem header="Breakpoints">
      <div className="flex flex-row items-center w-full">
        <MyCombobox
          value={algoName}
          values={algoNames}
          onChange={onAddClick}
          placeholder="search by name"
        />
      </div>
      <table className="w-full">
        <thead className="text-sm font-200 text-neutral-500">
          <tr>
            <th className="border-r w-auto">Name</th>
            <th className="border-r w-4">Enable</th>
            <th className="w-1">Remove</th>
          </tr>
        </thead>
        <tbody>
          {breakpoints.length > 0 ? (
            breakpoints.map((bp, idx) => (
              <BreakpointItem
                key={uuid()}
                data={bp}
                idx={idx}
                onRemoveClick={(idx: number) => props.rmBreak(idx)}
                onToggleClick={(idx: number) => props.toggleBreak(idx)}
              />
            ))
          ) : (
            <tr className="text-center text p-4 text-sm">
              <td colSpan={3}>
                No breakpoints. Add Breakpoint by clicking on steps in spec
                viewer or by searching name
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </StateViewerItem>
  );
});
