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
    <tr className="odd:bg-neutral-100 even:bg-white hover:bg-neutral-200 transition-all">
      <td className="border-r overflow-hidden font-mono text-wrap break-all text-center">
        {name}
      </td>
      <td className="border-r text-center">
        <MySwitch checked={enabled} onChange={() => handleToggleClick()} />
      </td>
      <td className="">
        <button
          className="h-full size-full items-center flex justify-center hover:text-red-600 active:scale-90 transition-all"
          onClick={() => handleRemoveClick()}
        >
          <XIcon />
        </button>
      </td>
    </tr>
  );
}
