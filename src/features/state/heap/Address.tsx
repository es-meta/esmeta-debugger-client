import { ReduxState } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ObjectView from "./ObjViewer";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, RewindIcon } from "lucide-react";
import { backToProvenance } from "@/store/reducers/Debugger";
import CopyButton from "@/components/button/CopyButton";

interface Props {
  address: `${string}`;
  initialFold?: boolean;
}

export default function Address({ address, initialFold }: Props) {

  const dispatch = useDispatch();

  const [fold, setFold] = useState(initialFold === undefined ? false : initialFold);
  const obj = useSelector((s: ReduxState) => s.irState.heap[address]);

  return (
    <div className="flex flex-col size-full">
      <span className="flex flex-row items-center justify-center break-all font-mono">{address}

        {address && address.startsWith('#') && !Number.isNaN(Number(address.substring(1))) && <a
          onClick={() => {
            dispatch(backToProvenance(address));
          }}
          className="text-blue-400 inline cursor-pointer hover:text-blue-600 active:scale-50 transition-all"
        >
          <RewindIcon size={16} className="inline" />
        </a>}
        <CopyButton className="text-es-500 inline cursor-pointer hover:text-es-900 active:scale-50 transition-all" content={address}>
          <CopyIcon size={16} />
        </CopyButton>
       <a className="inline cursor-pointer text-es-500 hover:text-es-900 active:scale-50 transition-all" onClick={() => setFold(f => !f)}> {
        fold ? <ChevronUpIcon size={16} className="inline" /> : <ChevronDownIcon size={16} className="inline" />}</a></span>
      {fold && (
        obj ? <ObjectView obj={obj} /> : <div>Not found</div>
      )}
    </div>
  );
}

