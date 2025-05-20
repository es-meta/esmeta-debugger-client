import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import MyCombobox from "./BreakCombobox";
import { AppState, Breakpoint, BreakpointType } from "@/types";
import BreakpointItem from "./BreakpointItem";
import StateViewerItem from "../StateViewerItem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolbarButton from "@/features/toolbar/button";
import { OctagonIcon, OctagonPauseIcon } from "lucide-react";
import { atoms, useAtomValue, useSetAtom } from "@/atoms";
import { ExtractAtomArgs, useAtom } from "jotai";

// TODO support turning off or toggling breakpoints
export function addBreakHandler(
  toEnabled: true,
  fid: number | null,
  breakpoints: Breakpoint[],
  algos: Record<number, { fid: number; name: string }>,
  addBreak: (...args: ExtractAtomArgs<typeof atoms.bp.addAction>) => void,
): string | null {
  const algoName = fid !== null ? algos[fid]?.name : null;
  const algoNames = Object.values(algos).map(algo => algo.name);

  if (fid === null || algoName === null) {
    return algoName;
  }

  const steps: number[] = [1];

  const bpName = `${steps} @ ${algoName}`;
  const duplicated = breakpoints.some(
    ({ duplicateCheckId }) => duplicateCheckId === bpName,
  );
  const valid = algoNames.includes(algoName);
  if (valid && !duplicated)
    addBreak({
      type: BreakpointType.Spec,
      fid: fid,
      duplicateCheckId: bpName,
      name: algoName,
      steps: steps,
      enabled: true,
    });
  else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
  else toast.warning(`Wrong algorithm name: ${algoName}`);
  return algoName;
}

// TODO add util buttons
// delete all
// disable all
// sort
export default function Breakpoints() {
  const algos = useAtomValue(atoms.spec.irFuncsAtom);
  const algoNames = useMemo(
    () => Object.values(algos).map(algo => algo.name),
    [algos],
  );

  const breakpoints = useAtomValue(atoms.bp.bpAtom);
  const [ignoreBp, setIgnoreBp] = useAtom(atoms.app.ignoreBPAtom);
  const appState = useAtomValue(atoms.app.appState);
  const disableQuit =
    appState === AppState.INIT || appState === AppState.JS_INPUT;
  const [algoName, setAlgoName] = useState<string | null>(null);

  const rmBreak = useSetAtom(atoms.bp.rmAction);
  const addbreak = useSetAtom(atoms.bp.addAction);

  const onAddClick = useCallback(
    (name: string | null) => {
      const fid =
        Object.values(algos).find(algo => algo.name === name)?.fid ?? null;
      setAlgoName(addBreakHandler(true, fid, breakpoints, algos, addbreak));
    },
    [breakpoints, algos],
  );

  const toggleStepWithoutBreak = useCallback(() => {
    setIgnoreBp(b => !b);
  }, [setIgnoreBp]);

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
                  ? "h-6 bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 hover:dark:bg-blue-500 text-white hover:text-white"
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
                onRemoveClick={(idx: number) => rmBreak(idx)}
                onToggleClick={() => null}
                // TODO onToggleClick={(idx: number) => dispatch(toggleBreak(idx))}
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
