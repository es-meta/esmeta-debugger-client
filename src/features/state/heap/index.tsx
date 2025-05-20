import { useMemo } from "react";
import Combobox from "@/components/button/combobox";
import StateViewerItem from "../StateViewerItem";
import TreeAddress from "./TreeAddress";
import { useAtom, useAtomValue } from "jotai";
import { atoms } from "@/atoms";

export default function HeapView() {
  const heap = useAtomValue(atoms.state.heapAtom);
  const addrs = useMemo(() => Object.keys(heap), [heap]);
  const [addr, setAddr] = useAtom(atoms.client.clientActiveAddrAtom);

  return (
    <StateViewerItem header="Specification&nbsp;Heap">
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
      <div className="w-full">
        <ul className="text-sm">
          {addr !== null ? (
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
