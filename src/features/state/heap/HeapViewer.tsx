import { useEffect, useState } from "react";
import Combobox from "@/components/button/combobox";
import StateViewerItem from "../StateViewerItem";
import TreeAddress from "./TreeAddress";
import { useAtom } from "jotai";
import { clientActiveAddrAtom } from "@/atoms/defs/client";
import { useAppSelector } from "@/hooks";

export default function HeapViewer() {
  const [addr, setAddr] = useAtom(clientActiveAddrAtom);

  const heap = useAppSelector(st => st.ir.heap);

  const obj = addr !== null ? (heap[addr] ?? null) : null;
  const addrs = Object.keys(heap);

  if (!heap) {
    return <div>Loading...</div>;
  }

  return (
    <StateViewerItem
      header="Specification&nbsp;Heap"
      // headerItems={<GuideTooltip />}
    >
      <div className="w-full">
        <div className="flex flex-row items-center w-full border-b font-mono ">
          <Combobox
            values={addrs}
            value={addr}
            placeholder="Select an address"
            onChange={newAddr => {
              if (newAddr === null) return;
              setAddr(newAddr);
            }}
          />
        </div>
        <ul className="text-sm">
          {addr !== null && obj !== null ? (
            <TreeAddress field={addr} address={addr} singleMode />
          ) : (
            <aside className="text-center py-4">
              Address is empty. Please select an address from the combobox.
            </aside>
          )}
        </ul>
      </div>
    </StateViewerItem>
  );
}
