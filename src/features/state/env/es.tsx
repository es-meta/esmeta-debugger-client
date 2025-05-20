import StateViewerItem from "../StateViewerItem";

import tw from "tailwind-styled-components";
import TreeAddress from "../heap/TreeAddress";
import { CodeSquareIcon } from "lucide-react";
import { atoms } from "@/atoms";
import { SuspenseBoundary } from "@/components/primitives/suspense-boundary";
import { useLastResolvedAtomValue } from "@/hooks/use-atom-value-with-pending";

const Li = tw.li`border-b`;
const B = tw.span`font-600`;

export default function ESEnvViewer() {
  const [isPending, bindings] = useLastResolvedAtomValue(
    atoms.state.esEnvAtom,
    [],
  );

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Environment"
      icon={<CodeSquareIcon size={14} />}
      // headerItems={<GuideTooltip />}
    >
      <SuspenseBoundary
        intentional
        loading={
          <div className="size-full flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <ul className="px-1 list-disc list-inside">
          {bindings.length === 0 ? (
            <aside className="text-center py-4">
              No environment variables.
            </aside>
          ) : (
            bindings.map(([name, value]) =>
              value === undefined ? null : value.startsWith("#") ? ( //     { //   <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center"> //   </td> //   <td className="border-r font-mono text-wrap py-1 break-all text-center overflow-hidden"> // > //   )} //     ), //       { "bg-[#BAF7D0]!": name === "return" }, //       "hover:bg-neutral-200 transition-all", //       "even:bg-white odd:bg-neutral-100 font-500", //     clsx( //   className={twJoin( //   key={v4()} // <tr
                <TreeAddress field={name} address={value} defaultFold />
              ) : (
                <Li>
                  <B>{name}</B>&nbsp;:&nbsp;{value}
                </Li>
              ),
            )
          )}
        </ul>
      </SuspenseBoundary>
    </StateViewerItem>
  );
}
