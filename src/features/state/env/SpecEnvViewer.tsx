import { useMemo } from "react";
import { twJoin } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import { Environment } from "@/store/reducers/IrState";
import StateViewerItem from "../StateViewerItem";
import clsx from "clsx";
import Address, { GuideTooltip } from "@/features/state/heap/Address";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";

export default function SpecEnvViewer() {
  const props = useSelector((st: ReduxState) => ({
    irState: st.irState,
  }));
  const { callStack, contextIdx } = props.irState;

  const env: Environment =
    callStack.length > 0 ? callStack[contextIdx].env : [];

  const sorted = useMemo(
    () =>
      env.filter(entry => {
        const [name] = entry;
        return !(name.startsWith("__") && name.endsWith("__"));
      }).slice().sort((a, b) => {
        if (a[0] === "return") return -1;
        if (b[0] === "return") return 1;
        return a[0].localeCompare(b[0]);
      }),
    [env],
  );

  return (
    <StateViewerItem
      header="Specification&nbsp;Environment"
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
          {sorted.length === 0 ? (
            <tr className="text-center text p-4">
              <td colSpan={2} className="text-center text-neutral-500 p-4 text-sm">
                No environment variables.
              </td>
            </tr>
          ) : (
            sorted.map(([name, value]) => (
              <tr
                key={uuid()}
                className={twJoin(
                  clsx(
                    "even:bg-white odd:bg-neutral-100",
                    "hover:bg-neutral-200 transition-all",
                    { "!bg-[#BAF7D0]": name === "return" },
                  ),
                )}
              >
                <td className="border-r font-mono text-wrap py-1 break-all text-center overflow-hidden">
                  {name}
                </td>
                <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center">
                  {value.startsWith("#") ? <Address address={value} /> : value}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
