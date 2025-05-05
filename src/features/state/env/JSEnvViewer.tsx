import StateViewerItem from "../StateViewerItem";

import { EXECUTION_STACK_ADDR } from "@/constants";
import { Binding, GetBindingValue } from "./getBindings";
import { Heap } from "@/types/heap.types";
import { useMemo } from "react";
import tw from "tailwind-styled-components";
import TreeAddress from "../heap/TreeAddress";
import { CodeSquareIcon } from "lucide-react";
import { useAppSelector } from "@/hooks";

const Li = tw.li`border-b`;
const B = tw.span`font-600`;

function computeBindings(heap: Heap): Binding[] {
  const stack = heap[EXECUTION_STACK_ADDR];
  if (!stack || stack.type !== "ListObj") return [];
  const firstFrameAddr = stack.values[0];
  if (!firstFrameAddr) return [];
  const topExecutionContextRecord = heap[firstFrameAddr];
  if (
    !topExecutionContextRecord ||
    topExecutionContextRecord.type !== "RecordObj"
  )
    return [];
  const lexicalEnvironment =
    topExecutionContextRecord.map["LexicalEnvironment"];
  if (!lexicalEnvironment) return [];
  return GetBindingValue(heap, lexicalEnvironment)
    .filter(
      ([name, value]) =>
        !name.startsWith('"') ||
        !name.endsWith('"') ||
        value === undefined ||
        !value.endsWith("#"),
    )
    .map(([name, value]) => [name.substring(1, name.length - 1), value]);
}

export default function JSEnvViewer() {
  const heap = useAppSelector(st => st.ir.heap);
  const bindings = useMemo(() => computeBindings(heap), [heap]);

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Environment"
      icon={<CodeSquareIcon size={14} />}
      // headerItems={<GuideTooltip />}
    >
      {/* <table className="w-full text-xs">
        <thead className="text-sm font-200 text-neutral-500">
          <tr>
            <th className="border-r w-1/4">name</th>
            <th className="w-3/4">value</th>
          </tr>
        </thead>
        <tbody> */}
      <ul className="text-sm px-1 font-mono list-disc list-inside">
        {bindings.length === 0 ? (
          // <tr className="text-center text p-4">
          //   <td colSpan={2} className="text-center text-neutral-500 p-4 text-sm">
          <p className="text-center text-neutral-500 p-4 text-sm">
            No environment variables.
          </p>
        ) : (
          bindings.map(
            ([name, value]) =>
              value === undefined ? null : value.startsWith("#") ? ( //     { //   <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center"> //   </td> //   <td className="border-r font-mono text-wrap py-1 break-all text-center overflow-hidden"> // > //   )} //     ), //       { "!bg-[#BAF7D0]": name === "return" }, //       "hover:bg-neutral-200 transition-all", //       "even:bg-white odd:bg-neutral-100 font-500", //     clsx( //   className={twJoin( //   key={v4()} // <tr
                <TreeAddress field={name} address={value} defaultFold />
              ) : (
                <Li>
                  <B>{name}</B>&nbsp;:&nbsp;{value}
                </Li>
              ),
            //       }
            //   </td>
            // </tr>
          )
        )}
        {/* </tbody>
      </table>
       */}
      </ul>
    </StateViewerItem>
  );
}
