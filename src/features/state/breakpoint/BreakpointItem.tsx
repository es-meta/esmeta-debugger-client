import { useCallback } from "react";

import { Breakpoint } from "@/store/reducers/Breakpoint";
import { XIcon } from "lucide-react";

import MySwitch from "@/components/button/MySwitch";

interface BreakpointItemProp {
  data: Breakpoint;
  idx: number;
  onRemoveClick: (idx: number) => void;
  onToggleClick: (idx: number) => void;
}

export default function BreakpointItem(props: BreakpointItemProp) {
  const {
    idx,
    onToggleClick,
    onRemoveClick,
    data: { name, enabled },
  } = props;

  const handleToggleClick = useCallback(() => {
    onToggleClick(idx);
  }, [onToggleClick, idx]);

  const handleRemoveClick = useCallback(() => {
    onRemoveClick(idx);
  }, [onRemoveClick, idx]);

  return (
    <tr>
      <th className="overflow-hidden">
        {/* <Tooltip title={name}>
          <span>{name}</span>
        </Tooltip> */}
        {name}
      </th>
      <th>
        <MySwitch checked={enabled} onChange={() => handleToggleClick()} />
      </th>
      <th>
        <button onClick={() => handleRemoveClick()}>
          <XIcon />
        </button>
      </th>
    </tr>
  );
}
