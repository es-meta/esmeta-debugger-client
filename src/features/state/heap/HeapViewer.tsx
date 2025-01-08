import  { useState } from "react";
import MyCombobox from "@/components/combobox/MyCombobox";
import StateViewerItem from "../StateViewerItem";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
import Address from "./Address";
// import { CopyIcon } from "lucide-react";
// import CopyButton from "@/components/button/CopyButton";

export default function HeapViewer() {
  const [addr, setAddr] = useState<string | null>(null);

  const heap = useSelector((s: ReduxState) => s.irState.heap);
  const obj = addr !== null ? (heap[addr] ?? null) : null;
  const addrs = Object.keys(heap);

  if (!heap) {
    return <div>Loading...</div>;
  }

  return (
    <StateViewerItem header="Heap Viewer">
      <div className="w-full">
        <div className="flex flex-row items-center w-full">
          <MyCombobox
            values={addrs}
            value={addr}
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
          {/* <CopyButton className="flex flex-row text-sm" content={obj?.stringform}>
            <CopyIcon size={16} />  
            copy string form
          </CopyButton> */}
        </div>
        {addr !== null && obj !== null && (
          <Address address={addr} initialFold={true} />
        )}
        
      </div>
    </StateViewerItem>
  );
}
