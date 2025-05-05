import { useEffect, useState } from "react";
import Combobox from "@/components/button/combobox";
import StateViewerItem from "../StateViewerItem";
import { HistoryIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TreeAddress from "./TreeAddress";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { clientActiveAddrAtom } from "@/atoms/defs/client";
import { useAppSelector } from "@/hooks";

function HistoryViewer({ history }: { history: string[] }) {
  const setAddr = useSetAtom(clientActiveAddrAtom);

  return (
    <Tooltip>
      <TooltipTrigger className="aspect-square h-full flex items-center justify-center px-1 text-neutral-500 dark:text-neutral-400">
        <HistoryIcon size={18} />
      </TooltipTrigger>
      <TooltipContent>
        <p className="flex flex-col text-sm items-start">
          {history.length === 0
            ? "No history"
            : history.map(addr => (
                <button
                  key={addr}
                  className="active:scale-95 transition-all hover:opacity-50"
                  onClick={() => setAddr(addr)}
                >
                  {addr}
                </button>
              ))}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function HeapViewer() {
  const [history, setHistory] = useState<string[]>([]);
  const [addr, setAddr] = useAtom(clientActiveAddrAtom);

  const heap = useAppSelector(st => st.ir.heap);

  const obj = addr !== null ? (heap[addr] ?? null) : null;
  const addrs = Object.keys(heap);

  useEffect(() => {
    if (addr !== null) {
      setHistory(h => {
        if (h.includes(addr))
          return [...h.filter(a => a !== addr), addr].slice(-5);
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
      // headerItems={<GuideTooltip />}
    >
      <div className="w-full">
        <div className="flex flex-row items-center w-full">
          <Combobox
            values={addrs}
            value={addr}
            placeholder="Select an address"
            onChange={newAddr => {
              if (newAddr === null) return;
              setAddr(newAddr);
            }}
          />
          <HistoryViewer history={history} />
        </div>
        <ul className="text-sm">
          {addr !== null && obj !== null ? (
            <TreeAddress field={addr} address={addr} singleMode />
          ) : (
            <li className="text-center text-neutral-500 dark:text-neutral-400 p-4 text-sm">
              Address is empty. Please select an address from the combobox.
            </li>
          )}
        </ul>
      </div>
    </StateViewerItem>
  );
}
