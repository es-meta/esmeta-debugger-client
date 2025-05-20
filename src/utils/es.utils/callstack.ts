import { EXECUTION_STACK_ADDR } from "@/constants";
import { Heap } from "@/types";
import { logger } from "../logger.utils";
import { toast } from "react-toastify";

export function readJSExecutionStack(heap: Heap) {
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
