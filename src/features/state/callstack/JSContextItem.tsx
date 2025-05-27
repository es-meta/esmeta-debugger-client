import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ESContext } from "@/types";
import TreeAddress from "../heap/TreeAddress";

interface Props extends ESContext {
  idx: number;
  globalExpand: boolean | null;
  setGlobalExpand: (expand: boolean | null) => void;
}

const className = `
  even:bg-neutral-400/10 odd:bg-neutral-400/5 text-xs
  hover:bg-neutral-400/5 active:bg-green-500/25 transition-all cursor-pointer
  data-[highlight]:even:bg-green-500/25 data-[highlight]:odd:bg-green-500/25 data-[highlight]:hover:bg-green-500/50
`;

export default function JSContextItem({
  idx,
  globalExpand,
  setGlobalExpand,
  ...context
}: Props) {
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (globalExpand !== null) {
      setExpand(globalExpand);
    }
  }, [globalExpand]);

  return (
    <>
      <tr className={className} onClick={() => /* onItemClick(idx) */ {}}>
        <td className="py-1 border-r text-center">{idx}</td>
        <td className="border-r text-center text-wrap break-all">
          {context.type}
        </td>
        <td className="">
          <button
            className="size-full flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setExpand(expand => !expand);
              setGlobalExpand(null);
            }}
          >
            {expand ? (
              <ChevronUpIcon size={14} />
            ) : (
              <ChevronDownIcon size={14} />
            )}
          </button>
        </td>
      </tr>
      {expand && (
        <tr>
          <td colSpan={4}>
            <TreeAddress
              field="this is unused in singleMode, TODO - remove"
              address={context.address}
              singleMode
            />
          </td>
        </tr>
      )}
    </>
  );
}
