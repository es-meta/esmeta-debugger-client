import { useCallback, useMemo } from "react";
import { XIcon } from "lucide-react";

import { Breakpoint } from "@/types";
import { Switch } from "@/components/button/switch";
import { cn, toStepString } from "@/utils";
import { AlgoViewerHeaderUsingAlgoName } from "@/features/spec/algo/AlgoViewerHeader";

interface BreakpointItemProp {
  data: Breakpoint;
  idx: number;
  onRemoveClick: (idx: number) => void;
  onToggleClick: (idx: number) => void;
}

export default function BreakpointItem(props: BreakpointItemProp) {
  const { idx, onToggleClick, onRemoveClick, data } = props;

  const isEven = useMemo(() => idx % 2 === 0, [idx]);

  const { viewName, enabled } = data;

  const handleToggleClick = useCallback(() => {
    onToggleClick(idx);
  }, [onToggleClick, idx]);

  const handleRemoveClick = useCallback(() => {
    onRemoveClick(idx);
  }, [onRemoveClick, idx]);

  // if (data.type === "BreakpointType/Js") {
  //   logger.error?.("Js breakpoint is not supported");
  //   return null;
  // }

  return (
    <>
      <tr
        className={cn(
          " hover:bg-neutral-500/25 transition-all",
          isEven
            ? "bg-white dark:bg-neutral-900"
            : "bg-neutral-100 dark:bg-neutral-800",
        )}
      >
        <td className="lowercase border-r overflow-hidden text-wrap text-center">
          {toStepString(data.steps)}
        </td>
        <td className="border-r overflow-hidden break-before-all text-wrap pb-1">
          <AlgoViewerHeaderUsingAlgoName name={viewName} />
        </td>
        <td className="border-r text-center">
          <Switch checked={enabled} onChange={() => handleToggleClick()} />
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
    </>
  );
}
