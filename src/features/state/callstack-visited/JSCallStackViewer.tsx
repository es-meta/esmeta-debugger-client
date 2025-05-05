import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import StateViewerItem from "../StateViewerItem";
import { EXECUTION_STACK_ADDR } from "@/constants";
import { logger } from "@/utils";
import { toast } from "react-toastify";
import JSContextItem from "./JSContextItem";
import { useAppSelector } from "@/hooks";
import { Heap } from "@/types";
import { useMemo } from "react";

function readJSExecutionStack(heap: Heap) {
  try {
    const execStack = heap[EXECUTION_STACK_ADDR];
    if (execStack?.type !== "ListObj") {
      return [];
    }

    return execStack.values.map(addr => {
      if (!addr.startsWith("#"))
        throw new Error("Invalid address in execution stack");
      const jsContext = heap[addr];
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
        const funcVal = heap[f];
        if (!funcVal || funcVal.type !== "RecordObj")
          throw new Error("Invalid address in execution stack");

        const subMapAddr = funcVal.map["__MAP__"];
        if (!subMapAddr) throw new Error("Invalid address in execution stack");

        const subMap = heap[subMapAddr];
        if (!subMap || subMap.type !== "MapObj")
          throw new Error("Invalid address in execution stack");

        const nameDescriptorAddr = subMap.map['"name"'];

        if (!nameDescriptorAddr)
          throw new Error("Invalid address in execution stack");

        const nameDescriptor = heap[nameDescriptorAddr];

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
    logger.error?.("Assertion related to JavaScript failed:", e);
    toast.error(
      "Failed to read JavaScript Execution Stack : is the program running?",
    );
    return [];
  }
}

export default function JSCallStackViewer() {
  const heap = useAppSelector(st => st.ir.heap);
  const executionStack = useMemo(() => readJSExecutionStack(heap), [heap]);

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Call&nbsp;Stack"
      headerItems={
        <div className="flex flex-row space-x-2 text-sm">
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
      <table className="w-full border-t">
        <thead className="text-sm font-200">
          <tr>
            <th className="border-r w-8 border-b">#</th>
            <th className="border-r w-fit border-b">type</th>
            <th className="w-4 border-b">show</th>
          </tr>
        </thead>
        <tbody>
          {executionStack.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <aside className="text-center py-4">
                  JavaScript call stack is empty.
                  <br />
                  Evaluating script not yet started or already finished.
                </aside>
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
