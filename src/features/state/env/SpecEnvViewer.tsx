import { useMemo } from "react";
import { twJoin } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import { Environment } from "@/store/reducers/IrState";
import StateViewerItem from "../StateViewerItem";
import clsx from "clsx";
// import Address, { GuideTooltip } from "@/features/state/heap/Address";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
import TreeAddress from "../heap/TreeAddress";
import { BookTextIcon } from "lucide-react";

export default function SpecEnvViewer() {
  const props = useSelector((st: ReduxState) => ({
    irState: st.irState,
  }));
  const { callStack, contextIdx } = props.irState;

  const env: Environment =
    callStack.length > 0 ? callStack[contextIdx].env : [];

  const sorted = useMemo(
    () =>
      env
        .filter(entry => {
          const [name] = entry;
          return !(name.startsWith("__") && name.endsWith("__"));
        })
        .slice()
        .sort((a, b) => {
          if (a[0] === "return") return -1;
          if (b[0] === "return") return 1;
          return a[0].localeCompare(b[0]);
        })
        .map(([name, value]) =>
          name === "return" ? ["RETURN", value] : [name, value],
        ),
    // temp fix for return value name
    [env],
  );

  return (
    <StateViewerItem
      header="Specification&nbsp;Environment"
      icon={<BookTextIcon size={14} />}
    >
      {sorted.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400 p-4 text-sm">
          No environment variables.
        </p>
      ) : (
        //   <tr className="text-center text p-4">
        // </tr>
        sorted.map(([name, value]) => (
          <ul
            key={uuid()}
            className={twJoin(
              clsx(
                "text-sm font-mono",
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
      {/* </tbody> */}
      {/* </table> */}
    </StateViewerItem>
  );
}
