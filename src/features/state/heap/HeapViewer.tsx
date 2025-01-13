import { useCallback, useEffect, useState } from "react";
import MyCombobox from "@/components/combobox/MyCombobox";
import StateViewerItem from "../StateViewerItem";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch, ReduxState } from "@/store";
import Address, { GuideTooltip, ProvinenceButton } from "./Address";
import { setHeapViewerAddr } from "@/store/reducers/Client";
import { HistoryIcon } from "lucide-react";

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function HistoryViewer({ history, dispatch }: { history: string[], dispatch: Dispatch }) {
  return (
    <Tooltip>
      <TooltipTrigger className="aspect-square h-full flex items-center justify-center px-1 text-neutral-500"><HistoryIcon size={18} /></TooltipTrigger>
      <TooltipContent>
        <p className="flex flex-col text-sm items-start">
          {history.map((addr, idx) => <button
            key={idx}
            className="active:scale-95 transition-all hover:opacity-50"
            onClick={() => dispatch(setHeapViewerAddr(addr))}>{addr}</button>)}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function HeapViewer() {
  const dispatch = useDispatch();
  const [history, setHistory] = useState<string[]>([]);
  
  const { heap,
    addr
  } = useSelector((s: ReduxState) => ({
    heap: s.irState.heap,
    addr: s.client.stateviewer.addr,
  }), shallowEqual);

  const obj = addr !== null ? (heap[addr] ?? null) : null;
  const addrs = Object.keys(heap);

  const setAddr = useCallback(
    (newAddr: string | null) => {
      dispatch(setHeapViewerAddr(newAddr));
    },
    [dispatch],
  );

  useEffect(() => {
    if (addr !== null) {
      setHistory(h => {
        if (h.includes(addr)) return [...(h.filter(a => a !== addr)), addr].slice(-5);
        return [...h, addr].slice(-5);
      });
    }
  }, [addr]);

  if (!heap) {
    return <div>Loading...</div>;
  }

  return (
    <StateViewerItem
      header="Specification&nbsp;Heap"
      headerItems={<GuideTooltip />}
    >
      <div className="w-full">
        <div className="flex flex-row items-center w-full">
          <MyCombobox
            values={addrs}
            value={addr}
            placeholder="Select an address"
            onChange={newAddr => {
              if (newAddr === null) return;
              setAddr(newAddr);
            }}
          />
          <HistoryViewer history={history} dispatch={dispatch} />
          <ProvinenceButton address={addr || undefined} />
        </div>
        {(addr !== null && obj !== null) ? <Address address={addr} singleMode /> :
          <p className="text-center text-neutral-500 p-4 text-sm">
            Address is empty. Please select an address from the combobox.
          </p>}
      </div>
    </StateViewerItem>
  );
}
