import { HeapObj } from "@/types/heap.types";
import TreeAddress, { ProvinenceButton } from "./TreeAddress";
import tw from "tailwind-styled-components";

interface Props {
  obj: HeapObj;
  singleMode?: boolean;
  address: string;
}

const Ul = tw.ul`pl-4 list-inside list-disc border-y`;
const Li = tw.li`border-b`;
const B = tw.b`font-600`;
// const  = tw.ul`pl-2 list-inside list-disc`

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
        <Ul>
          {singleMode && (
            <li className="break-all list-none">
              {typeString}
              <ProvinenceButton address={address} />
            </li>
          )}
          {Object.keys(obj.map).length === 0 ? (
            <p>No values</p>
          ) : (
            Object.entries(obj.map).map(
              ([key, value]) =>
                // <tr key={v4()} className="even:bg-white odd:bg-neutral-100 hover:bg-neutral-200 transition-all">
                value && value.startsWith("#") ? (
                  <TreeAddress field={key} address={value} />
                ) : (
                  <Li className="font-mono text-wrap break-all overflow-hidden gap-2">
                    <B>{key}</B>&nbsp;:&nbsp;{value}
                  </Li>
                ),

              // </tr>
            )
          )}
        </Ul>
        // </table>
      )}
      {obj.type === "MapObj" && (
        <Ul>
          {/* // <table className="bg-white font-mono text-center text-xs">
          // <thead>
          //   <tr>
          //     <th className="border-r w-1/4">key</th>
          //     <th className="w-3/4">value</th>
          //   </tr>
          // </thead>
          // <tbody> */}

          {singleMode && (
            <li className="break-all list-none">
              {typeString}
              <ProvinenceButton address={address} />
            </li>
          )}

          {Object.keys(obj.map).length === 0 ? (
            <>
              <tr>
                <td colSpan={2}>No values</td>
              </tr>
            </>
          ) : (
            Object.entries(obj.map).map(
              ([key, value]) =>
                value && value.startsWith("#") ? (
                  <TreeAddress field={key} address={value} />
                ) : (
                  <Li className="font-mono text-wrap break-all overflow-hidden gap-2">
                    <B>{key}</B>&nbsp;:&nbsp;{value}
                  </Li>
                ),

              // </tr>
            )
          )}
          {/* </tbody>
        </table> */}
        </Ul>
      )}
      {obj.type === "ListObj" && (
        <Ul>
          {/* // <table className="bg-white font-mono text-center text-xs">
        //   <thead>
        //     <tr>
        //       <th className="border-r w-1/4">key</th>
        //       <th className="w-3/4">value</th>
        //     </tr>
        //   </thead>
        //   <tbody> */}
          {singleMode && (
            <li className="break-all list-none">
              {typeString}
              <ProvinenceButton address={address} />
            </li>
          )}
          {Object.keys(obj.values).length === 0 ? (
            <Li>No values</Li>
          ) : (
            obj.values.map(
              (value, idx) =>
                value && value.startsWith("#") ? (
                  <TreeAddress field={idx.toString()} address={value} />
                ) : (
                  <Li className="font-mono text-wrap break-all overflow-hidden gap-2">
                    <B>{idx}</B>&nbsp;:&nbsp;{value}
                  </Li>
                ),

              // </tr>
            )
          )}
          {/* </tbody>
        </table> */}
        </Ul>
      )}
      {obj.type === "YetObj" && (
        <div className="font-mono p-1 text-center">
          this object is not yet supported in ESMeta
        </div>
      )}
    </>
  );
}
