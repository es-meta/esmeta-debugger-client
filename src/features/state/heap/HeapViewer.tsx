import { useCallback, useState } from "react";
import MyCombobox from "@/components/combobox/MyCombobox";
import StateViewerItem from "../StateViewerItem";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import Address, { GuideTooltip, ProvinenceButton } from "./Address";
import { setHeapViewerAddr } from "@/store/reducers/Client";

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
