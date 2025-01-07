import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import ContextItem from "./ContextItem";
import StateViewerItem from "../StateViewerItem";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { updateContextIdx } from "@/store/reducers/IrState";
import { ContextVisitedViewer } from "./algo/AlgoVisitedViewer";

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
    <StateViewerItem header="Call Stack">
      <table className="w-full border-y border-y-neutral-300">
        <thead>
          <tr>
            <th className="w-1/12">#</th>
            <th className="w-11/12">name</th>
            <th>show</th>
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
