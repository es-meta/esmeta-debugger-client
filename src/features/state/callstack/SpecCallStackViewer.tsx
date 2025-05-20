import { useCallback, useMemo } from "react";
import SpecContextItem from "./SpecContextItem";
import StateViewerItem from "../StateViewerItem";
import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import { v4 } from "uuid";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atoms } from "@/atoms";
import { contextIdxAtom } from "@/atoms/defs/state";

const globalExpandAtom = atom<boolean | null>(null);

export default function SpecCallStackViewer() {
  const [globalExpand, setGlobalExpand] = useAtom(globalExpandAtom);
  const callStack = useAtomValue(atoms.state.callstackAtom);

  const setContextIdx = useSetAtom(contextIdxAtom);
  const onItemClick = useCallback(
    (idx: number) => setContextIdx(idx),
    [setContextIdx],
  );

  const prefix = useMemo(() => v4(), [callStack]);

  return (
    <StateViewerItem
      header="Specification&nbsp;Call&nbsp;Stack"
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
            <th className="border-r w-8">#</th>
            <th className="border-r w-8">step</th>
            <th className="border-r">name</th>
            <th className="w-4">show</th>
          </tr>
        </thead>
        <tbody>
          {callStack.map((ctxt, idx) => (
            <SpecContextItem
              key={prefix + idx}
              data={ctxt}
              idx={idx}
              onItemClick={onItemClick}
              globalExpand={globalExpand}
              setGlobalExpand={setGlobalExpand}
            />
          ))}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
