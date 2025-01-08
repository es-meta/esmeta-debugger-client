import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import ContextItem from "./ContextItem";
import StateViewerItem from "../StateViewerItem";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { updateContextIdx } from "@/store/reducers/IrState";

export default function CallStackViewer() {
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
      <table className="w-full">
        <thead>
          <tr>
            <th className="border w-4">#</th>
            <th className="border ">name</th>
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
            />
          ))}
        </tbody>
      </table>
    </StateViewerItem>
  );
}
