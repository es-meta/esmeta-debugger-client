import { useEffect, useMemo, useRef, useState } from "react";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";
import { ContextVisitedViewer } from "./algo/AlgoVisitedViewer";
import { Breakpoint } from "@/store/reducers/Breakpoint";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { SpecFuncInfo, toggleMap } from "@/store/reducers/Spec";

type ContextItemProps = {
  data: Context;
  idx: number;
  onItemClick: (idx: number) => void;
  breakpoints: Breakpoint[];
  globalExpand: boolean | null;
  setGlobalExpand: (expand: boolean | null) => void;
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

function replacedName(name: string, irToSpecMapping: Record<string, SpecFuncInfo>) {
  const specInfo = irToSpecMapping[name];
  if (specInfo.isBuiltIn) {
    return name.substring('INTRINSICS.'.length);
  }
  if (specInfo.isSdo && specInfo.sdoInfo && specInfo.sdoInfo.prod) {
    return `${specInfo.sdoInfo.method} of ${specInfo.sdoInfo.prod?.astName}`;
  }
  return name;
}

export default function SpecContextItem(props: ContextItemProps) {
  const [expand, setExpand] = useState<boolean>(false);

  const {highlight, irToSpecMapping} = useSelector((s: ReduxState) => ({
    highlight: s.irState.contextIdx === props.idx,
    irToSpecMapping: s.spec.irToSpecMapping,
  }), shallowEqual);

  const className = useMemo(() => {
    return twMerge(
      "even:bg-white odd:bg-neutral-50 text-xs",
      "hover:bg-neutral-100 active:bg-green-100 transition-all cursor-pointer",
      highlight && "even:bg-green-200 odd:bg-green-200 hover:bg-green-300",
    );
  }, [highlight]);

  const { data, idx, onItemClick, breakpoints, globalExpand, setGlobalExpand } = props;
  const { name, steps } = data;
  // TODO beautify steps
  const stepString = steps.length === 0 ? '' : toStepString(steps);

  useEffect(() => {
    if (globalExpand !== null) {
      setExpand(globalExpand);
    }
  }, [globalExpand]);


  const specName = replacedName(name, irToSpecMapping);

  return (
    <>
      <tr className={className} onClick={() => onItemClick(idx)}>
        <td className="py-1 border-r text-center">{idx}</td>
        <td className="border-r text-center text-wrap break-all">
          {stepString}
        </td>
        <td className="border-r text-center text-wrap break-all font-mono">
          {specName}
        </td>
        <td className="">
          <button
            className="size-full text-black/50 hover:text-black/25 flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setExpand((prev) => !prev);
              setGlobalExpand(null);
            }}
          >
            {expand ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
          </button>
        </td>
      </tr>
      {expand &&
        (data.algo.code !== "" ? (
          <tr>
            <td colSpan={4}>
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
