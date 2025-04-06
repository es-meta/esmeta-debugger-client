import { FoldVerticalIcon, InfoIcon, UnfoldVerticalIcon } from "lucide-react";
import StateViewerItem from "../StateViewerItem";
import { useSelector } from "react-redux";
import { EXECUTION_STACK_ADDR } from "@/constants/constant";
import { ReduxState } from "@/store";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import JSContextItem, { JSContext } from "./JSContextItem";

function readJSExecutionStack(state: ReduxState): JSContext[] {
  try {
    const execStack = state.irState.heap[EXECUTION_STACK_ADDR];
    if (execStack?.type !== "ListObj") {
      return [];
    }

    return execStack.values.map(addr => {
      if (!addr.startsWith("#"))
        throw new Error("Invalid address in execution stack");
      const jsContext = state.irState.heap[addr];
      if (!jsContext) throw new Error("Invalid address in execution stack");
      if (jsContext.type !== "RecordObj")
        throw new Error("Invalid type in execution stack");

      const f = jsContext.map["Function"];
      const som = jsContext.map["ScriptOrModule"];

      if (f === "null" && som === "null") {
        return {
          type: "HostDefined",
          address: addr,
        };
      }

      if (f !== "null" && f !== undefined) {
        const funcVal = state.irState.heap[f];
        if (!funcVal || funcVal.type !== "RecordObj")
          throw new Error("Invalid address in execution stack");

        const subMapAddr = funcVal.map["__MAP__"];
        if (!subMapAddr) throw new Error("Invalid address in execution stack");

        const subMap = state.irState.heap[subMapAddr];
        if (!subMap || subMap.type !== "MapObj")
          throw new Error("Invalid address in execution stack");

        const nameDescriptorAddr = subMap.map['"name"'];

        if (!nameDescriptorAddr)
          throw new Error("Invalid address in execution stack");

        const nameDescriptor = state.irState.heap[nameDescriptorAddr];

        if (!nameDescriptor || nameDescriptor.type !== "RecordObj")
          throw new Error("Invalid address in execution stack");

        const nameWithQoute = nameDescriptor.map["Value"];
        if (!nameWithQoute)
          throw new Error("Invalid address in execution stack");

        const name = nameWithQoute.slice(1, -1);

        return {
          type: name ? `Function (${name})` : "Function",
          address: addr,
        };
      }

      return {
        type: "ScriptOrModule",
        address: addr,
      };
    });
  } catch (e) {
    console.error("Assertion related to JavaScript failed:", e);
    toast.error(
      "Failed to read JavaScript Execution Stack : is the program running?",
    );
    return [];
  }
}

export default function JSCallStackViewer() {
  const executionStack = useSelector(readJSExecutionStack);

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Call&nbsp;Stack"
      headerItems={
        <div className="flex flex-row space-x-2 text-neutral-600 text-sm">
          {/* <Info /> */}
          <button
            className="flex flex-row hover:bg-neutral-200 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => {
              // setShows(Array(executionStack.length).fill(true));
            }}
          >
            <UnfoldVerticalIcon size={16} />
            expand
          </button>
          <button
            className="flex flex-row hover:bg-neutral-200 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => {
              // setShows(Array(executionStack.length).fill(false));
            }}
          >
            <FoldVerticalIcon size={16} />
            collapse
          </button>
        </div>
      }
    >
      <table className="w-full">
        <thead className="text-sm font-200 text-neutral-500">
          <tr>
            <th className="border-r w-8">#</th>
            <th className="border-r w-fit">type</th>
            <th className="w-4">show</th>
          </tr>
        </thead>
        <tbody>
          {executionStack.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center text-neutral-500 p-4 text-sm"
              >
                JavaScript call stack is empty, maybe evaluating script not yet
                started or already finished.
              </td>
            </tr>
          ) : (
            executionStack.map((ctxt, idx) => (
              <JSContextItem key={idx} idx={idx} {...ctxt} />
            ))
          )}
        </tbody>
      </table>
    </StateViewerItem>
  );
}

// function Info() {
//   return (
//     <Tooltip>
//       <TooltipTrigger>
//         <InfoIcon size={16} />
//       </TooltipTrigger>
//       <TooltipContent>
//       <p>
//           Note that this information is already lives in the mechanized specification environements and heaps,
//           <br />
//           especially on <code>{EXECUTION_STACK_ADDR}</code>, since the mechanized spec is an interpreter of JavaScript.
//       </p>
//       </TooltipContent>
//     </Tooltip>
//   );
// }
