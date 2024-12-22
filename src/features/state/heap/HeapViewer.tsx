import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import MyCombobox from "@/components/combobox/MyCombobox";
import { CopyIcon } from "lucide-react";

import { connector, type HeapViewerProps } from "./HeapViewer.redux";

export default connector(function HeapViewer({ heap }: HeapViewerProps) {
  const [addr, setAddr] = useState("");

  const addrs = Object.keys(heap);
  const obj = heap[addr];

  const handleCopy = useCallback(() => {
    // obj가 존재할 때만 클립보드에 복사
    if (obj !== undefined) {
      navigator.clipboard
        .writeText(obj)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(err => toast.error("Failed to copy: ", err));
    } else {
      toast.info("Nothing to copy!");
    }
  }, [obj]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center w-full">
        <MyCombobox values={addrs} value={addr} onChange={setAddr} />
        <button onClick={handleCopy}>
          <CopyIcon />
        </button>
      </div>

      <pre className="p-4 bg-neutral-200">{obj || "NOT FOUND"}</pre>
    </div>
  );
});
