import React, { useMemo } from "react";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";

type ContextItemProps = {
  data: Context;
  highlight: boolean;
  idx: number;
  onItemClick: (idx: number) => void;
};

export default function ContextItem(props: ContextItemProps) {
  const className = useMemo(() => {
    const { highlight } = props;
    return twMerge(
      "even:bg-white odd:bg-neutral-50",
      "hover:bg-neutral-100 hover:scale-[0.98] active:scale-95 transition-all cursor-pointer",
      highlight && "even:bg-green-200 odd:bg-green-200 hover:bg-green-300",
    );
  }, [props.highlight]);

  const { data, idx, onItemClick } = props;
  const { name, steps } = data;
  // TODO beautify steps
  const content = steps.length === 0 ? name : `${steps} @ ${name}`;

  return (
    <tr className={className} onClick={() => onItemClick(idx)}>
      <th className="border">{idx}</th>
      <th className="border">{content}</th>
    </tr>
  );
}
