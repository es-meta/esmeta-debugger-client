import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import { connector, type CallStackViewerProps } from "./CallStackViewer.redux";
import ContextItem from "./ContextItem";

export default connector(function CallStackViewer(props: CallStackViewerProps) {
  const {
    irState: { callStack, contextIdx },
    updateContextIdx,
  } = props;

  const onItemClick = useCallback(
    (idx: number) => {
      updateContextIdx(idx);
    },
    [updateContextIdx],
  );

  return (
    <table className="w-full border-y border-y-neutral-300">
      <thead>
        <tr>
          <th className="w-1/12">#</th>
          <th className="w-11/12">name</th>
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
  );
});
