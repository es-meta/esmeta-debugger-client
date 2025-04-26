import { useCallback, useMemo, useState } from "react";
import SpecContextItem from "./SpecContextItem";
import StateViewerItem from "../StateViewerItem";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { updateContextIdx } from "@/store/reducers/IrState";
import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import { v4 } from "uuid";

export default function SpecCallStackViewer() {
  const dispatch = useDispatch();
  const [globalExpand, setGlobalExpand] = useState<boolean | null>(null);

  const { callStack, breakpoints } = useSelector(
    (st: ReduxState) => ({
      callStack: st.irState.callStack,
      breakpoints: st.breakpoint.items,
    }),
    shallowEqual,
  );

  const onItemClick = useCallback(
    (idx: number) => {
      dispatch(updateContextIdx(idx));
    },
    [dispatch],
  );

  const prefix = useMemo(() => v4(), [callStack, breakpoints]);

  return (
    <StateViewerItem
      header="Specification&nbsp;Call&nbsp;Stack"
      headerItems={
        <div className="flex flex-row space-x-2 text-sm">
          <button
            className="flex flex-row hover:bg-neutral-500/25 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => callStack.forEach(() => setGlobalExpand(true))}
          >
            <UnfoldVerticalIcon size={16} />
            expand
          </button>
          <button
            className="flex flex-row hover:bg-neutral-500/25 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => callStack.forEach(() => setGlobalExpand(false))}
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
              breakpoints={breakpoints}
              globalExpand={globalExpand}
              setGlobalExpand={setGlobalExpand}
            />
          ))}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
