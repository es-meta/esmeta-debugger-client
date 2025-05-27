import { ESEnv, Heap } from "@/types";
import { EXECUTION_STACK_ADDR } from "@/constants";
import { GetBindingValue } from "./env.utils";

export function computeESEnv(heap: Heap): ESEnv {
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
