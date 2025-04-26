import { useEffect, useMemo, useState } from "react";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";
import { ContextVisitedViewer } from "./algo/AlgoVisitedViewer";
import { Breakpoint } from "@/store/reducers/Breakpoint";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { shallowEqual, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { IrToSpecMapping } from "@/store/reducers/Spec";
import { toStepString } from "@/util/numbering.util";

type ContextItemProps = {
  data: Context;
  idx: number;
  onItemClick: (idx: number) => void;
  breakpoints: Breakpoint[];
  globalExpand: boolean | null;
  setGlobalExpand: (expand: boolean | null) => void;
};

function replacedName(name: string, irToSpecMapping: IrToSpecMapping): string {
  const specInfo = irToSpecMapping[name];
  if (specInfo?.isBuiltIn) {
    return name.substring("INTRINSICS.".length);
  }
  if (specInfo?.isSdo && specInfo?.sdoInfo && specInfo?.sdoInfo.prod) {
    return `${specInfo.sdoInfo.method} of ${specInfo.sdoInfo.prod?.astName}`;
  }
  if (specInfo?.methodInfo) {
    return specInfo.methodInfo[1];
  }
  return name;
}

export default function SpecContextItem(props: ContextItemProps) {
  const [expand, setExpand] = useState<boolean>(false);

  const { highlight, irToSpecMapping } = useSelector(
    (s: ReduxState) => ({
      highlight: s.irState.contextIdx === props.idx,
      irToSpecMapping: s.spec.irToSpecMapping,
    }),
    shallowEqual,
  );

  const className = useMemo(() => {
    return twMerge(
      "even:bg-neutral-400/10 odd:bg-neutral-400/5 text-xs",
      "hover:bg-neutral-400/5 active:bg-green-500/25 transition-all cursor-pointer",
      highlight &&
        "even:bg-green-500/25 odd:bg-green-500/25 hover:bg-green-500/50",
    );
  }, [highlight]);

  const { data, idx, onItemClick, breakpoints, globalExpand, setGlobalExpand } =
    props;
  const { name, steps } = data;
  // TODO beautify steps
  const stepString = steps.length === 0 ? "" : toStepString(steps);

  useEffect(() => {
    if (globalExpand !== null) {
      setExpand(globalExpand);
    }
  }, [globalExpand]);

  const specName = useMemo(
    () => replacedName(name, irToSpecMapping),
    [name, irToSpecMapping],
  );

  return (
    <>
      <tr className={className} onClick={() => onItemClick(idx)}>
        <td className="py-1 border-r text-center">{idx}</td>
        <td className="border-r text-center text-wrap lowercase break-all">
          {stepString}
        </td>
        <td className="border-r text-center text-wrap break-all font-es font-700 text-sm">
          {specName}
        </td>
        <td className="">
          <button
            className="size-full flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setExpand(prev => !prev);
              setGlobalExpand(null);
            }}
          >
            {expand ? (
              <ChevronUpIcon size={14} />
            ) : (
              <ChevronDownIcon size={14} />
            )}
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
