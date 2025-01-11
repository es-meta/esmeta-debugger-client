import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import ContextItem from "./ContextItem";
import StateViewerItem from "../StateViewerItem";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { updateContextIdx } from "@/store/reducers/IrState";
import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import { toggleMap } from "@/store/reducers/Spec";

export default function CallStackViewerWithVisited() {
  const dispatch = useDispatch();

  const {
    irState: { callStack, contextIdx },
    breakpoints,
  } = useSelector((st: ReduxState) => ({
    irState: st.irState,
    breakpoints: st.breakpoint.items,
  }));

  const onItemClick = useCallback(
    (idx: number) => {
      dispatch(updateContextIdx(idx));
    },
    [dispatch],
  );

  return (
    <StateViewerItem
      header="Specification&nbsp;Call&nbsp;Stack"
      headerItems={
        <div className="flex flex-row space-x-2 text-neutral-600 text-sm">
          <button
            className="flex flex-row hover:bg-neutral-200 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => {
              callStack.forEach(ctxt => {
                dispatch(toggleMap(ctxt.name, true));
              });
            }}
          >
            <UnfoldVerticalIcon size={16} />
            expand
          </button>
          <button
            className="flex flex-row hover:bg-neutral-200 rounded items-center gap-1 active:scale-90 transition-all"
            onClick={() => {
              callStack.forEach(ctxt => {
                dispatch(toggleMap(ctxt.name, false));
              });
            }}
          >
            <FoldVerticalIcon size={16} />
            collapse
          </button>
        </div>
      }
    >
      <table className="w-full">
        <thead className="text-sm font-200 text-neutral-500">
          <tr>
            <th className="border-r w-8">#</th>
            <th className="border-r w-8">position</th>
            <th className="border-r">name</th>
            <th className="w-4">show</th>
          </tr>
        </thead>
        <tbody>
          {callStack.map((ctxt, idx) => (
            <ContextItem
              key={uuid()}
              data={ctxt}
              idx={idx}
              highlight={idx === contextIdx}
              onItemClick={onItemClick}
              breakpoints={breakpoints}
            />
          ))}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
