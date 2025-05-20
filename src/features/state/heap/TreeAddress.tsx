import { useState } from "react";
import TreeObjViewer from "./TreeObjViewer";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleHelpIcon,
  RewindIcon,
  SearchIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HeapObj } from "@/types";
import {
  clientActiveAddrAtom,
  clientActiveViewerAtom,
} from "@/atoms/defs/client";
import { atoms, useSetAtom } from "@/atoms";
import { backToProvenanceAction } from "@/actions";
import { useLastResolvedAtomValue } from "@/hooks/use-atom-value-with-pending";

interface Props {
  field: string;
  address: `${string}`;
  singleMode?: boolean;
  defaultFold?: boolean;
}

export function ProvinenceButton({ address }: { address?: string }) {
  const backToProvenance = useSetAtom(backToProvenanceAction);

  return (
    address &&
    address.startsWith("#") &&
    !Number.isNaN(Number(address.substring(1))) && (
      <Tooltip>
        <TooltipTrigger
          className=" text-blue-400 inline cursor-pointer hover:text-blue-600 active:scale-75 transition-all"
          onClick={() => backToProvenance(address)}
        >
          <RewindIcon size={16} className="inline" />
        </TooltipTrigger>
        <TooltipContent>Go back to provenance</TooltipContent>
      </Tooltip>
    )
  );
}

function InspectInHeappViewer({ address }: { address: string }) {
  const setAddr = useSetAtom(clientActiveAddrAtom);
  const setView = useSetAtom(clientActiveViewerAtom);

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

function getTypeString(obj: HeapObj | undefined) {
  if (!obj) return "";
  const type = obj?.type;
  return type === "RecordObj"
    ? `: Record[${obj.tname}]`
    : type === "YetObj"
      ? `: Yet[${obj.tname}]`
      : type === "MapObj"
        ? `: Map`
        : ": List";
}

export default function TreeAddress({
  field,
  address,
  singleMode,
  defaultFold = false,
}: Props) {
  const [fold, setFold] = useState(
    singleMode === undefined ? defaultFold : singleMode,
  );
  const [, heap] = useLastResolvedAtomValue(atoms.state.heapAtom, {});
  const obj = heap[address];

  return (
    <>
      {!singleMode && (
        <li className="border-b">
          <b className="font-600 font-mono">{field}</b>&nbsp;
          {getTypeString(obj)}&nbsp;
          <span className="inline-flex flex-row items-center">
            <ProvinenceButton address={address} />
            <InspectInHeappViewer address={address} />
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
          </span>
        </li>
      )}
      {fold &&
        (obj ? (
          <TreeObjViewer address={address} singleMode={singleMode} obj={obj} />
        ) : (
          <div>Not found</div>
        ))}
    </>
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
