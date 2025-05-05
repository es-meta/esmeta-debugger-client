import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

import MyCombobox from "./BreakCombobox";

import { AppState, Breakpoint, BreakpointType } from "@/types";

import { addBreak, rmBreak, toggleBreak } from "@/store/reducers/breapoint";

import BreakpointItem from "./BreakpointItem";
import StateViewerItem from "../StateViewerItem";
import { AppDispatch } from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolbarButton from "@/features/toolbar/ToolbarButton";
import { OctagonIcon, OctagonPauseIcon } from "lucide-react";
import { toggleIgnore } from "@/store/reducers/app-state";
import { atoms, useAtomValue } from "@/atoms";

import { ReduxState } from "@/store";

// connect redux store
export const mapStateToProps = (st: ReduxState) => ({
  breakpoints: st.breakpoint.items,
  ignoreBp: st.appState.ignoreBP,
  disableQuit:
    st.appState.state === AppState.INIT ||
    st.appState.state === AppState.JS_INPUT,
});

// TODO support turning off or toggling breakpoints
export function addBreakHandler(
  toEnabled: true,
  algoName: string | null,
  breakpoints: Breakpoint[],
  algos: Record<string, number>,
  dispatch: AppDispatch,
): string | null {
  if (algoName === null) {
    return algoName;
  }

  const steps: number[] = [1];

  const bpName = `${steps} @ ${algoName}`;
  const duplicated = breakpoints.some(
    ({ duplicateCheckId }) => duplicateCheckId === bpName,
  );
  const valid = algos.hasOwnProperty(algoName);
  if (valid && !duplicated)
    dispatch(
      addBreak({
        type: BreakpointType.Spec,
        fid: algos[algoName],
        duplicateCheckId: bpName,
        name: algoName,
        steps: steps,
        enabled: true,
      }),
    );
  else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
  else toast.warning(`Wrong algorithm name: ${algoName}`);
  return algoName;
}

// TODO add util buttons
// delete all
// disable all
// sort
export default function Breakpoints() {
  const dispatch = useAppDispatch();
  const algos = useAtomValue(atoms.spec.nameMapAtom);
  const algoNames = useMemo(() => Object.keys(algos), [algos]);
  const { breakpoints, ignoreBp, disableQuit } =
    useAppSelector(mapStateToProps);
  const [algoName, setAlgoName] = useState<string | null>(null);

  const onAddClick = useCallback(
    (name: string | null) => {
      setAlgoName(addBreakHandler(true, name, breakpoints, algos, dispatch));
    },
    [breakpoints, algos],
  );

  const toggleStepWithoutBreak = useCallback(() => {
    dispatch(toggleIgnore());
  }, [dispatch]);

  return (
    <StateViewerItem
      header="Breakpoints"
      headerItems={
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton
              position="single"
              disabled={disableQuit}
              onClick={toggleStepWithoutBreak}
              className={
                ignoreBp
                  ? "h-6 bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:text-white"
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
      }
    >
      <div className="flex flex-row items-center w-full text-xs">
        <MyCombobox
          value={algoName}
          values={algoNames}
          onChange={onAddClick}
          placeholder="search by name"
        />
      </div>
      <table className="w-full text-xs border-t">
        <thead className="font-200 text-neutral-500 dark:text-neutral-400">
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
                onRemoveClick={(idx: number) => dispatch(rmBreak(idx))}
                onToggleClick={(idx: number) => dispatch(toggleBreak(idx))}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center text-neutral-500 dark:text-neutral-400 p-4 text-sm"
              >
                No breakpoints. Add Breakpoint by clicking on steps in spec
                viewer or by searching name
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
