import { HeapObj } from "@/types/heap.type";
import TreeAddress, { ProvinenceButton } from "./TreeAddress";
import { v4 } from "uuid";

interface Props {
  obj: HeapObj;
  singleMode?: boolean;
  address: string;
}
export default function TreeObjViewer({ obj, singleMode, address }: Props) {
  const type = obj?.type;
  const typeString =
    type === "RecordObj"
      ? `Record[${obj.tname}]`
      : type === "YetObj"
        ? `Yet[${obj.tname}]`
        : type === "MapObj"
          ? `Map`
          : "List";

  return (
    <>
      {obj.type === "RecordObj" && (
        // <table className="bg-white font-mono text-center text-xs">
          <ul className="w-full">
          <caption className="break-all w-full">{typeString}
            {singleMode && <ProvinenceButton address={address} />}
          </caption>
            {Object.keys(obj.map).length === 0 ? (
                <p>No values</p>
            ) : (
              Object.entries(obj.map).map(([key, value]) => (
                // <tr key={v4()} className="even:bg-white odd:bg-neutral-100 hover:bg-neutral-200 transition-all">
                <li className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center">
                  {key} : 
                    {value && value.startsWith("#") ? (
                      <TreeAddress address={value} />
                    ) : (
                      value
                    )}
                  </li>
                // </tr>
              ))
            )}
          </ul>
        // </table>
      )}
      {obj.type === "MapObj" && (
        <table className="bg-white font-mono text-center text-xs">
          <caption className="break-all">{typeString}
          {singleMode && <ProvinenceButton address={address} />}
          </caption>
          <thead>
            <tr>
              <th className="border-r w-1/4">key</th>
              <th className="w-3/4">value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(obj.map).length === 0 ? (
              <>
                <tr>
                  <td colSpan={2}>No values</td>
                </tr>
              </>
            ) : (
              Object.entries(obj.map).map(([key, value]) => (
                <tr key={v4()} className="even:bg-white odd:bg-neutral-100 hover:bg-neutral-200 transition-all">
                  <td className="border-r">{key}</td>
                  <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center">
                    {value && value.startsWith("#") ? (
                      <TreeAddress address={value} />
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {obj.type === "ListObj" && (
        <table className="bg-white font-mono text-center text-xs">
          <caption className="break-all">{typeString}{singleMode && <ProvinenceButton address={address} />}</caption>
          <thead>
            <tr>
              <th className="border-r w-1/4">key</th>
              <th className="w-3/4">value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(obj.values).length === 0 ? (
              <tr>
                <td key={v4()} colSpan={2}>No values</td>
              </tr>
            ) : (
              obj.values.map((value, idx) => (
                <tr className="even:bg-white odd:bg-neutral-100 hover:bg-neutral-200 transition-all">
                  <td className="border-r">{idx}</td>
                  <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center">
                    {value.startsWith("#") ? (
                      <TreeAddress address={value} />
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {obj.type === "YetObj" && (
        <div className="font-mono p-1 text-center">
          this object is not yet supported in ESMeta
        </div>
      )}
    </>
  );
}
