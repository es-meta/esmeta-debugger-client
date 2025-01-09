import { useCallback, useState } from "react";
import MyCombobox from "@/components/combobox/MyCombobox";
import StateViewerItem from "../StateViewerItem";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import Address, { ProvinenceButton } from "./Address";
import {
  ChevronDownIcon,
  CircleHelpIcon,
  RewindIcon,
  SearchIcon,
} from "lucide-react";
import { setHeapViewerAddr } from "@/store/reducers/Client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { CopyIcon } from "lucide-react";
// import CopyButton from "@/components/button/CopyButton";

function Guide() {
  return         <div className="flex flex-col items-start text-xs  gap-1">
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
}

export default function HeapViewer() {
  const dispatch = useDispatch();
  const { heap, addr } = useSelector((s: ReduxState) => ({
    heap: s.irState.heap,
    addr: s.client.stateviewer.addr,
  }));
  const obj = addr !== null ? (heap[addr] ?? null) : null;
  const addrs = Object.keys(heap);

  const setAddr = useCallback(
    (newAddr: string | null) => {
      dispatch(setHeapViewerAddr(newAddr));
    },
    [dispatch],
  );

  if (!heap) {
    return <div>Loading...</div>;
  }

  return (
    <StateViewerItem header="Specification&nbsp;Heap" headerItems={
      <Tooltip>
        <TooltipTrigger className="flex flex-row items-center gap-1 text-sm">
        <CircleHelpIcon size={16} /> Help
          </TooltipTrigger>
        <TooltipContent>
        <Guide />
        </TooltipContent>
      </Tooltip>
    }>
      <div className="w-full">
        <div className="flex flex-row items-center w-full">
          <MyCombobox
            values={addrs}
            value={addr}
            placeholder="Select an address"
            onChange={newAddr => {
              if (newAddr === null) return;

              // setTabs(tabs => {
              //   if (!tabs.includes(newAddr)) {
              //     return [...tabs, newAddr];
              //   }
              //   return tabs;
              // });

              setAddr(newAddr);
            }}
          />
          <ProvinenceButton address={addr || undefined} />
          {/* <CopyButton className="flex flex-row text-sm" content={obj?.stringform}>
            <CopyIcon size={16} />  
            copy string form
          </CopyButton> */}
        </div>
        {addr !== null && obj !== null && <Address address={addr} singleMode />}
      </div>
    </StateViewerItem>
  );
}
