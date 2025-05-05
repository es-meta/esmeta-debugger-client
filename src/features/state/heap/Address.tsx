import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ObjectView from "./ObjViewer";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleHelpIcon,
  RewindIcon,
  SearchIcon,
} from "lucide-react";
import { backToProvenanceAction } from "@/actions";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSetAtom } from "jotai";
import {
  clientActiveAddrAtom,
  clientActiveViewerAtom,
} from "@/atoms/defs/client";

interface Props {
  address: `${string}`;
  singleMode?: boolean;
  defaultFold?: boolean;
}

export function ProvinenceButton({ address }: { address?: string }) {
  const dispatch = useAppDispatch();

  return (
    address &&
    address.startsWith("#") &&
    !Number.isNaN(Number(address.substring(1))) && (
      <Tooltip>
        <TooltipTrigger
          className=" text-blue-400 inline cursor-pointer hover:text-blue-600 active:scale-75 transition-all"
          onClick={() => {
            dispatch(backToProvenanceAction(address));
          }}
        >
          <RewindIcon size={16} className="inline" />
        </TooltipTrigger>
        <TooltipContent>Go back to provenance</TooltipContent>
      </Tooltip>
    )
  );
}

function InspectInHaepViewer({ address }: { address: string }) {
  const setView = useSetAtom(clientActiveViewerAtom);
  const setAddr = useSetAtom(clientActiveAddrAtom);

  return (
    <Tooltip>
      <TooltipTrigger
        className="text-es-500 inline cursor-pointer hover:text-es-900 active:scale-75 transition-all"
        content={address}
        onClick={() => {
          setAddr(address);
          setView("heap");
        }}
      >
        <SearchIcon size={16} />
      </TooltipTrigger>
      <TooltipContent>
        <p>Inspect in heap viewer</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function Address({
  address,
  singleMode,
  defaultFold = false,
}: Props) {
  const [fold, setFold] = useState(
    singleMode === undefined ? defaultFold : singleMode,
  );
  const heap = useAppSelector(st => st.ir.heap);
  const obj = heap[address];

  return (
    <div className="flex flex-col size-full">
      {!singleMode && (
        <span
          className={
            singleMode
              ? "p-2 flex flex-row grow items-center justify-between break-all font-mono w-full gap-2"
              : "flex flex-row items-center justify-center break-all font-mono w-full gap-2"
          }
        >
          {address}

          <div className="flex flex-row items-center gap-1">
            <ProvinenceButton address={address} />
            <InspectInHaepViewer address={address} />
            <a
              className="inline cursor-pointer text-es-500 hover:text-es-900 active:scale-75 transition-all"
              onClick={() => setFold(f => !f)}
            >
              {fold ? (
                <ChevronUpIcon size={16} className="inline" />
              ) : (
                <ChevronDownIcon size={16} className="inline" />
              )}
            </a>
          </div>
        </span>
      )}
      {fold &&
        (obj ? (
          <ObjectView address={address} singleMode={singleMode} obj={obj} />
        ) : (
          <div>Not found</div>
        ))}
    </div>
  );
}

export function GuideTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger className="flex flex-row items-center gap-1 text-sm">
        <CircleHelpIcon size={16} /> Help
      </TooltipTrigger>
      <TooltipContent>
        <Guide />
      </TooltipContent>
    </Tooltip>
  );
}

function Guide() {
  return (
    <div className="flex flex-col items-start text-xs  gap-1">
      <p>values starting with # are addresses. you can do the following:</p>
      <div className="flex flex-row items-center text-xs">
        <RewindIcon className="text-blue-500" size={16} />
        &nbsp;Go back to provenance
      </div>
      <div className="flex flex-row items-center text-xs">
        <SearchIcon className="text-es-500" size={16} />
        &nbsp;Inspect in heap viewer
      </div>
      <div className="flex flex-row items-center text-xs">
        <ChevronDownIcon className="text-es-500" size={16} />
        &nbsp;Fold/Unfold inlined heap viewer
      </div>
    </div>
  );
}
