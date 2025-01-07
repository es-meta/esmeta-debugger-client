import { forwardRef, useCallback, useState } from "react";
import { toast } from "react-toastify";
import MyCombobox from "@/components/combobox/MyCombobox";
import { CopyIcon, XIcon } from "lucide-react";
import StateViewerItem from "../StateViewerItem";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
// import { useHeap } from "@/services/heap.service";

import { z } from "zod";

const HeapSchema = z.record(z.string(), z.string());

function HeapObjView({ obj }: { obj: HeapObj }) {}

export default function HeapViewer() {
  const [addr, setAddr] = useState<string | null>(null);

  const heap = useSelector((s: ReduxState) => s.irState.heap);

  const obj = addr !== null ? (heap[addr] ?? null) : null;

  const addrs = Object.keys(heap);

  const [tabs, setTabs] = useState<string[]>([]);

  const handleCopy = useCallback(() => {
    // obj가 존재할 때만 클립보드에 복사
    if (obj !== null && obj !== undefined) {
      navigator.clipboard
        .writeText(obj.stringform)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(err => toast.error("Failed to copy: ", err));
    } else {
      toast.info("Nothing to copy!");
    }
  }, [obj]);

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

              setTabs(tabs => {
                if (!tabs.includes(newAddr)) {
                  return [...tabs, newAddr];
                }
                return tabs;
              });

              setAddr(newAddr);
            }}
          />
          <button onClick={handleCopy}>
            <CopyIcon />
          </button>
        </div>
        <Tabs
          tabs={tabs}
          setTabs={setTabs}
          selected={addr}
          setSelected={setAddr}
        />
        {obj?.type === "RecordObj" && (
          <div className="flex flex-col flex-wrap gap-1">
            type: {obj.tname}
            <table>
              <thead>
                <tr>
                  <th className="w-1/4">key</th>
                  <th className="w-3/4">value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(obj.map).map(([key, value]) => (
                  <tr>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {obj?.type === "ListObj" && (
          <div className="flex flex-col flex-wrap gap-1">
            type: {obj.type}
            <table>
              <thead>
                <tr>
                  <th className="w-1/4">key</th>
                  <th className="w-3/4">value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(obj.values).map(([idx, value]) => (
                  <tr>
                    <td>{idx}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {obj?.type === "YetObj" && <div>{/* {obj.tname} */}</div>}
        {obj && (
          <pre className="p-4 bg-neutral-200">
            {JSON.stringify(obj) || "NOT FOUND"}
          </pre>
        )}
      </div>
    </StateViewerItem>
  );
}

function Tabs({
  selected,
  setSelected,
  tabs,
  setTabs,
}: {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  tabs: string[];
  setTabs: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const removeTab = useCallback(
    (tab: string) => {
      setTabs(tabs => tabs.filter(t => t !== tab));
    },
    [setTabs],
  );

  return (
    <div className="w-full p-1">
      <fieldset className="flex flex-row flex-wrap gap-1">
        {tabs.map(tab => (
          <label htmlFor={`heapViewerChoice-${tab}`}>
            <input
              hidden
              className="peer"
              type="radio"
              id={`heapViewerChoice-${tab}`}
              name="contact"
              value={tab}
              checked={selected === tab}
            />
            <div
              className="group flex gap-1 flex-row items-center
          text-sm
          bg-neutral-100 hover:bg-neutral-200
          peer-checked:bg-green-300 px-2 py-1 rounded-full active:scale-90 transition-all"
            >
              <div onClick={() => setSelected(tab)}>{tab}</div>
              <XIcon size={16} onClick={() => removeTab(tab)} />
            </div>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
