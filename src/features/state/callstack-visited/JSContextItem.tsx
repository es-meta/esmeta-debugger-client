import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Address from "../heap/Address";

export interface JSContext {
  name: string;
  type: string;
  address: string;
}

interface Props extends JSContext {
  idx: number;
}

// function toAlpha(num: number): string {
//   return String.fromCharCode(65 + num - 1);
// }

// function toRoman(num: number): string {

//   const roman = [
//     ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
//     ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
//     ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
//     ["", "M", "MM", "MMM", "MMMM"],
//   ];

//   const digits = num.toString().split("").reverse();
//   let romanNum = "";
//   for (let i = 0; i < digits.length; i++) {
//     romanNum = roman[i][Number(digits[i])] + romanNum;
//   }
//   return romanNum;
// }

export default function JSContextItem(props: Props) {
  const [expand, setExpand] = useState(false);

  const className = useMemo(() => {
    // const { highlight } = props;
    const highlight = false;
    return twMerge(
      "even:bg-white odd:bg-neutral-50 text-xs",
      "hover:bg-neutral-100 active:bg-green-100 transition-all cursor-pointer",
      highlight && "even:bg-green-200 odd:bg-green-200 hover:bg-green-300",
    );
  }, []);

  // const { data, idx, onItemClick, breakpoints } = props;
  // const { name, steps } = data;
  // TODO beautify steps
  // const stepString = steps.length === 0 ? '' : toStepString(steps);

  return (
    <>
      <tr className={className} onClick={() => /* onItemClick(idx) */ { }}>
        <td className="py-1 border-r text-center">{props.idx}</td>
        <td className="border-r text-center text-wrap break-all">
          {props.type}
        </td>
        <td className="border-r text-center text-wrap break-all font-mono">
          {props.name}
        </td>
        <td className="">
          <button
            className="size-full text-black/50 hover:text-black/25 flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setExpand(expand => !expand);
            }}
          >
            {expand ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
          </button>
        </td>
      </tr>
      {expand && <tr>
        <td colSpan={4}>
        <Address address={props.address}  singleMode />
      </td>
      </tr>}
    </>
  );
}
