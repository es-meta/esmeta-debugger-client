import { useMemo } from "react";
import { twJoin } from "tailwind-merge";
import type { FlattendEnv, RawEnv } from "@/types";
import StateViewerItem from "../StateViewerItem";
import clsx from "clsx";
import TreeAddress from "../heap/TreeAddress";
import { BookTextIcon } from "lucide-react";
import { atoms, useAtomValue } from "@/atoms";
import { SuspenseBoundary } from "@/components/primitives/suspense-boundary";

const returnValue = Symbol();

function flattenEnv(env: RawEnv): FlattendEnv {
  const [normal = [], ret = []] = env;
  return [
    ...normal,
    ...ret.map(v => [returnValue, v] satisfies [symbol, string]),
  ] satisfies FlattendEnv;
}

export default function SpecEnvViewer() {
  const callStack = useAtomValue(atoms.state.callstackAtom);
  const contextIdx = useAtomValue(atoms.state.contextIdxAtom);

  const env: FlattendEnv = useMemo(
    () => flattenEnv(callStack[contextIdx]?.env ?? []),
    [callStack, contextIdx],
  );

  const sorted = useMemo(
    () =>
      env
        .filter(entry => {
          const [name] = entry;
          return !(
            typeof name === "string" &&
            name.startsWith("__") &&
            name.endsWith("__")
          );
        })
        .slice()
        .sort((a, b) => {
          if (typeof a[0] === "symbol") return -1;
          if (typeof b[0] === "symbol") return 1;
          return a[0].localeCompare(b[0]);
        })
        .map(([name, value]) =>
          typeof name === "symbol" ? ["RETURN", value] : [name, value],
        ),
    // temp fix for return value name
    [env],
  );

  return (
    <StateViewerItem
      header="Specification&nbsp;Environment"
      icon={<BookTextIcon size={14} />}
    >
      <SuspenseBoundary
        fatal
        loading={
          <div className="size-full flex items-center justify-center">
            Loading...
          </div>
        }
      >
        {sorted.length === 0 ? (
          <aside className="text-center py-4">No environment variables.</aside>
        ) : (
          sorted.map(([name, value]) => (
            <ul
              key={name}
              className={twJoin(
                clsx(
                  "list-inside list-disc px-1",
                  "hover:bg-neutral-500/25 transition-all",
                ),
              )}
            >
              {value.startsWith("#") ? (
                <TreeAddress field={name} address={value} />
              ) : (
                <li className="border-b text-wrap break-all text-left overflow-hidden gap-2 justify-center items-center">
                  <b className="font-600">{name}</b>&nbsp;:&nbsp;{value}
                </li>
              )}
            </ul>
          ))
        )}
      </SuspenseBoundary>
    </StateViewerItem>
  );
}
