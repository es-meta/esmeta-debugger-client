import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import StateViewerItem from "../StateViewerItem";
import JSContextItem from "./JSContextItem";
import { atoms, useAtom } from "@/atoms";
import { useLastResolvedAtomValue } from "@/hooks/use-atom-value-with-pending";
import { v4 } from "uuid";
import { useMemo } from "react";
import { atom } from "jotai";

const globalExpandAtom = atom<boolean | null>(null);

export default function JSCallStackViewer() {
  const [globalExpand, setGlobalExpand] = useAtom(globalExpandAtom);

  const [, executionStack] = useLastResolvedAtomValue(
    atoms.state.esExecutionStack,
    [],
  );

  const prefix = useMemo(() => v4(), [executionStack]);

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Call&nbsp;Stack"
      headerItems={
        <div className="flex flex-row space-x-2 text-sm">
          <button
            className="flex flex-row hover:bg-neutral-500/25 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => setGlobalExpand(true)}
          >
            <UnfoldVerticalIcon size={16} />
            expand
          </button>
          <button
            className="flex flex-row hover:bg-neutral-500/25 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => setGlobalExpand(false)}
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
              <JSContextItem
                key={prefix + idx}
                idx={idx}
                globalExpand={globalExpand}
                setGlobalExpand={setGlobalExpand}
                {...ctxt}
              />
            ))
          )}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
