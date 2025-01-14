import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

import MyCombobox from "./BreakCombobox";

import { addBreak, Breakpoint, BreakpointType } from "@/store/reducers/Breakpoint";

import { connector, type BreakpointsProps } from "./Breakpoints.redux";
import BreakpointItem from "./BreakpointItem";
import StateViewerItem from "../StateViewerItem";
import { Dispatch } from "@/store";
import { useDispatch } from "react-redux";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ToolbarButton from "@/features/toolbar/ToolbarButton";
import { OctagonIcon, OctagonPauseIcon } from "lucide-react";
import { AppStateActionType } from "@/store/reducers/AppState";

// TODO support turning off or toggling breakpoints
export function addBreakHandler(toEnabled: true, algoName: string | null, breakpoints: Breakpoint[], algos: Record<string, number>, dispatch: Dispatch): string | null {
    if (algoName === null) {
      return algoName;
    }

    const steps: number[] = [1];

    const bpName = `${steps} @ ${algoName}`;
    const duplicated = breakpoints.some(({ duplicateCheckId }) => duplicateCheckId === bpName);
    const valid = algos.hasOwnProperty(algoName);
    if (valid && !duplicated)
      dispatch(addBreak({
        type: BreakpointType.Spec,
        fid: algos[algoName],
        duplicateCheckId: bpName,
        name: algoName,
        steps: steps,
        enabled: true,
      }));
    else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
    else toast.warning(`Wrong algorithm name: ${algoName}`);
  return algoName;
};

// TODO add util buttons
// delete all
// disable all
// sort
export default connector(function Breakpoints(props: BreakpointsProps) {
  const dispatch = useDispatch<Dispatch>();
  const { breakpoints, algoNames, ignoreBp, disableQuit } = props;
  const [algoName, setAlgoName] = useState<string | null>(null);

  const onAddClick = useCallback((name: string | null) => {
    setAlgoName(addBreakHandler(true, name, breakpoints, props.algos, dispatch));
  }, [props.breakpoints, props.algos],
  );

  const toggleStepWithoutBreak = useCallback(() => {
    dispatch({ type: AppStateActionType.TOGGLE_IGNORE });
  }, [dispatch]);

  return (
    <StateViewerItem header="Breakpoints"
    
      headerItems={
        <Tooltip>
        <TooltipTrigger>
          <ToolbarButton
            position="single"
            disabled={disableQuit}
            onClick={toggleStepWithoutBreak}
            className={
              ignoreBp
                ? "h-6 bg-blue-600 hover:bg-blue-500 text-white hover:text-white"
                : "h-6"
            }
            icon={ignoreBp ? <OctagonIcon /> : <OctagonPauseIcon />}
            label={
              ignoreBp ? (
                <span>skipping breakpoints</span>
              ) : (
                <span>using breakpoints</span>
              )
            }
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>If this is toggled on, skip breakpoints when doing steps</p>
        </TooltipContent>
        </Tooltip>
        
    }>

        
      <div className="flex flex-row items-center w-full text-xs">
        <MyCombobox
          value={algoName}
          values={algoNames}
          onChange={onAddClick}
          placeholder="search by name"
        />
      </div>
      <table className="w-full text-xs">
        <thead className="font-200 text-neutral-500">
          <tr>
            <th className="border-r">Step</th>
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
                <tr >
            <td colSpan={4} className="text-center text-neutral-500 p-4 text-sm">
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
