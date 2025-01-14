import StateViewerItem from "../StateViewerItem";
import Address, { GuideTooltip } from "@/features/state/heap/Address";
import { useSelector } from "react-redux";

import { ReduxState } from "@/store";
import { EXECUTION_STACK_ADDR } from "@/constants/constant";
import { Binding, GetBindingValue } from "./getBindings";
import { v4 } from "uuid";
import clsx from "clsx";
import { twJoin } from "tailwind-merge";
import { Heap } from "@/types/heap.type";
import { useMemo } from "react";

// function selector(st: ReduxState): string | null {
//   const { heap } = st.irState;
  
//   const IS_EMPTY = (!heap || !heap[EXECUTION_STACK_ADDR]);
  
//   if (IS_EMPTY) return null;
//   // TODO use type defs

//   const eStack = heap[EXECUTION_STACK_ADDR];
//   if (!eStack || eStack.type !== 'ListObj') return null;

//   return eStack.values.at(0) || null;
// }

function computeBindings(heap: Heap): Binding[] {
  const stack = heap[EXECUTION_STACK_ADDR];
  if (!stack || stack.type !== 'ListObj') return [];
  const firstFrameAddr = stack.values[0];
  if (!firstFrameAddr) return [];
  const topExecutionContextRecord = heap[firstFrameAddr];
  if (!topExecutionContextRecord || topExecutionContextRecord.type !== 'RecordObj') return [];
  const lexicalEnvironment = topExecutionContextRecord.map['LexicalEnvironment'];
  if (!lexicalEnvironment) return [];
  return GetBindingValue(heap, lexicalEnvironment).filter(([name, value]) => !name.startsWith("\"") || !name.endsWith("\"") || value === undefined || !value.endsWith("#"))
    .map(([name, value]) => [name.substring(1, name.length-1), value]);
}

export default function JSEnvViewer() {

  const heap = useSelector((st: ReduxState) => st.irState.heap);

  const bindings = useMemo(() => computeBindings(heap), [heap]);

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Environment"
      // headerItems={<GuideTooltip />}
    >
            <table className="w-full text-xs">
        <thead className="text-sm font-200 text-neutral-500">
          <tr>
            <th className="border-r w-1/4">name</th>
            <th className="w-3/4">value</th>
          </tr>
        </thead>
        <tbody>
          {bindings.length === 0 ? (
            <tr className="text-center text p-4">
              <td colSpan={2} className="text-center text-neutral-500 p-4 text-sm">
                No environment variables.
              </td>
            </tr>
          ) : (
            bindings.map(([name, value]) => (value === undefined ? null : (
              <tr
                key={v4()}
                className={twJoin(
                  clsx(
                    "even:bg-white odd:bg-neutral-100 font-500",
                    "hover:bg-neutral-200 transition-all",
                    { "!bg-[#BAF7D0]": name === "return" },
                  ),
                )}
              >
                <td className="border-r font-mono text-wrap py-1 break-all text-center overflow-hidden">
                  {name}
                </td>
                <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center">
                  {value.startsWith('#') ? <Address address={value} defaultFold /> : value}
                </td>
              </tr>
            )))
          )}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
