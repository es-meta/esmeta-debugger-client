import { useMemo } from "react";
import { twJoin } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import { Environment } from "@/store/reducers/IrState";
import { connector, type SpecEnvViewerProps } from "./SpecEnvViewer.radix";
import StateViewerItem from "../StateViewerItem";
import clsx from "clsx";
import { backToProvenance, DebuggerAction } from "@/store/reducers/Debugger";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

export default connector(function SpecEnvViewer(props: SpecEnvViewerProps) {
  const { callStack, contextIdx } = props.irState;
  const dispatch = useDispatch<Dispatch<DebuggerAction>>();

  const env: Environment =
    callStack.length > 0 ? callStack[contextIdx].env : [];

  const sorted = useMemo(
    () =>
      env.slice().sort((a, b) => {
        if (a[0] === "return") return -1;
        if (b[0] === "return") return 1;
        return a[0].localeCompare(b[0]);
      }),
    [env],
  );

  return (
    <StateViewerItem header="Environment">
    <table className="w-full border-y border-y-neutral-300">
      <thead>
        <tr>
          <th className="w-1/4">name</th>
          <th className="w-3/4">value</th>
        </tr>
      </thead>
      <tbody>
          {sorted.map(([name, value]) => (
            <tr
              key={uuid()}
              className={twJoin(
                clsx(
                  "border-y border-y-neutral-300",
                  "even:bg-white odd:bg-neutral-50",
                  "hover:bg-neutral-100 transition-all",
                  { "!bg-[#BAF7D0]": name === "return" },
                ),
              )}
            >
              <th className="overflow-hidden">{name}</th>
              <th className="overflow-hidden flex flex-row gap-2 justify-center items-center">
                {value}
                {name === "return" && (
                  <button
                    onClick={() => {
                      dispatch(backToProvenance());
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Back To Provenance
                  </button>
                )}
              </th>

            </tr>))}
      </tbody>
        {
          /*
        </thead>
        <tbody>
          {sorted.map(([name, value]) => (
            <tr
              key={uuid()}
              className={twJoin(
                "border-y border-y-neutral-300",
                "even:bg-white odd:bg-neutral-50",
                "hover:bg-neutral-100 transition-all",
              )}
            >
              <th className="overflow-hidden">{name}</th>
              <th className="overflow-hidden">{value}</th>
            </tr>
          ))}
      </tbody>
      */
        }
      </table>
    </StateViewerItem>
  );
});

