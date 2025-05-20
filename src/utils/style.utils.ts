export { cn } from "@/lib/utils";

export function asDataAttribute(boolean: boolean): true | undefined {
  return boolean ? true : undefined;
}
