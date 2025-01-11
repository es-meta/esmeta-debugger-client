import { useMemo, useState } from "react";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";
import { ContextVisitedViewer } from "./algo/AlgoVisitedViewer";
import { Breakpoint } from "@/store/reducers/Breakpoint";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { toggleMap } from "@/store/reducers/Spec";

type ContextItemProps = {
  data: Context;
  highlight: boolean;
  idx: number;
  onItemClick: (idx: number) => void;
  breakpoints: Breakpoint[];
};

function toAlpha(num: number): string {
  return String.fromCharCode(65 + num - 1);
}

function toRoman(num: number): string {

  const roman = [
    ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
    ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
    ["", "M", "MM", "MMM", "MMMM"],
  ];

  const digits = num.toString().split("").reverse();
  let romanNum = "";
  for (let i = 0; i < digits.length; i++) {
    romanNum = roman[i][Number(digits[i])] + romanNum;
  }
  return romanNum;
}

function toStepString(steps: number[]) {
  let str = '';
  for (let i = 0; i < steps.length; i++) {
    switch (i % 3) {
      case 0:
        str += steps[i];
        break;
      case 1:
        str += toAlpha(steps[i]);
        break;
      case 2:
        str += toRoman(steps[i]);
        break;
    }
    if (i !== steps.length - 1) str += '.';
  }
  return str;
}

export default function ContextItem(props: ContextItemProps) {
  const dispatch = useDispatch();
  const expand = useSelector((s: ReduxState) => {
    const cand = s.spec.toggleMap[props.data.name];
    return cand;
  });

  const className = useMemo(() => {
    const { highlight } = props;
    return twMerge(
      "even:bg-white odd:bg-neutral-50 text-xs",
      "hover:bg-neutral-100 active:bg-green-100 transition-all cursor-pointer",
      highlight && "even:bg-green-200 odd:bg-green-200 hover:bg-green-300",
    );
  }, [props.highlight]);

  const { data, idx, onItemClick, breakpoints } = props;
  const { name, steps } = data;
  // TODO beautify steps
  const stepString = steps.length === 0 ? '' : toStepString(steps);

  return (
    <>
      <tr className={className} onClick={() => onItemClick(idx)}>
        <td className="py-1 border-r text-center">{idx}</td>
        <td className="border-r text-center text-wrap break-all">
          {stepString}
        </td>
        <td className="border-r text-center text-wrap break-all font-mono">
          {name}
        </td>
        <td className="">
          <button
            className="size-full text-black/50 hover:text-black/25 flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              dispatch(toggleMap(data.name, !expand));
            }}
          >
            {expand ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
          </button>
        </td>
      </tr>
      {expand &&
        (data.algo.code !== "" ? (
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
            <td
              colSpan={3}
              className="text-sm text-neutral-400 py-2 text-center"
            >
              this context has algorithm to show
            </td>
          </tr>
        ))}
    </>
  );
}
