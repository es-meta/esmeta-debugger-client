import { HeapObj } from "@/types/heap.type";
import Address, { ProvinenceButton } from "./Address";
import { v4 } from "uuid";

interface Props {
  obj: HeapObj;
  singleMode?: boolean;
  address: string;
}
export default function ObjectView({ obj, singleMode, address }: Props) {
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
              <tr>
                <td colSpan={2}>No values</td>
              </tr>
            ) : (
              Object.entries(obj.map).map(([key, value]) => (
                <tr key={v4()} className="even:bg-white odd:bg-neutral-100 hover:bg-neutral-200 transition-all">
                  <td className="border-r">{key}</td>
                  <td className="font-mono text-wrap break-all text-center overflow-hidden flex flex-row gap-2 justify-center items-center">
                    {value && value.startsWith("#") ? (
                      <Address address={value} />
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
                      <Address address={value} />
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
                      <Address address={value} />
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
