import type { Context } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { asDataAttribute, toStepString } from "@/utils";
import { ContextViewer } from "@/features/spec/ContextViewer";
import { atoms, useAtomValue } from "@/atoms";

type ContextItemProps = {
  data: Context;
  idx: number;
  onItemClick: (idx: number) => void;
  globalExpand: boolean | null;
  setGlobalExpand: (expand: boolean | null) => void;
};

const className = `
  even:bg-neutral-400/10 odd:bg-neutral-400/5 text-xs
  hover:bg-neutral-400/5 active:bg-green-500/25 transition-all cursor-pointer
  data-[highlight]:even:bg-green-500/25 data-[highlight]:odd:bg-green-500/25 data-[highlight]:hover:bg-green-500/50
`;

export default function SpecContextItem(props: ContextItemProps) {
  const [expand, setExpand] = useState<boolean>(false);
  const contextIdx = useAtomValue(atoms.state.contextIdxAtom);
  const highlight = asDataAttribute(contextIdx === props.idx);

  const { data, idx, onItemClick, globalExpand, setGlobalExpand } = props;
  const { fid, steps } = data;
  const stepString = steps.length === 0 ? "" : toStepString(steps);

  const irFuncs = useAtomValue(atoms.spec.irFuncsAtom);
  const irFunc = useMemo(() => irFuncs[fid], [irFuncs, fid]);
  const algoCode = useMemo(() => irFuncs[fid]?.algoCode, [fid]);
  const specName = useMemo(() => irFunc.nameForCallstack, [irFunc]);

  useEffect(() => {
    if (globalExpand !== null) {
      setExpand(globalExpand);
    }
  }, [globalExpand]);

  return (
    <>
      <tr
        className={className}
        data-highlight={highlight}
        onClick={() => onItemClick(idx)}
      >
        <td className="py-1 border-r text-center">{idx}</td>
        <td className="border-r text-center text-wrap lowercase">
          {stepString}
        </td>
        <td className="border-r text-center text-wrap font-es font-700 text-sm">
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
        (algoCode !== "" ? (
          <tr>
            <td colSpan={4}>
              <ContextViewer embed context={data} />
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
