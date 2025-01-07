import { useMemo, useState } from "react";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";
import { ContextVisitedViewer } from "./algo/AlgoVisitedViewer";
import { Breakpoint } from "@/store/reducers/Breakpoint";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type ContextItemProps = {
  data: Context;
  highlight: boolean;
  idx: number;
  onItemClick: (idx: number) => void;
  breakpoints: Breakpoint[];
};

export default function ContextItem(props: ContextItemProps) {
  const [fold, setFold] = useState(true);

  const className = useMemo(() => {
    const { highlight } = props;
    return twMerge(
      "border-y border-y-neutral-300",
      "even:bg-white odd:bg-neutral-50",
      "hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer",
      highlight && "even:bg-green-200 odd:bg-green-200 hover:bg-green-300",
    );
  }, [props.highlight]);

  const { data, idx, onItemClick, breakpoints } = props;
  const { name, steps } = data;
  // TODO beautify steps
  const content = steps.length === 0 ? name : `${steps} @ ${name}`;

  return (
    <>
      <tr className={className} onClick={() => onItemClick(idx)}>
        <td>{idx}</td>
        <td>{content}</td>
        <td>
          <button
            className="size-full hover:text-black/25 flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setFold(f => !f);
            }}
          >
            {fold ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </td>
      </tr>
      {fold ? null : data.algo.code !== "" ? (
        <tr>
          <td colSpan={3}>
            <ContextVisitedViewer
              context={data}
              algo={data.algo}
              breakpoints={breakpoints}
            />
          </td>
        </tr>
      ) : (
        <tr>
          <td colSpan={3} className="text-sm text-neutral-400 py-2 text-center">
            this context has algorithm to show
          </td>
        </tr>
      )}
    </>
  );
}
