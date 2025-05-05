import { useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/utils";
import Address from "../heap/Address";

export interface JSContext {
  // name: string;
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
    return cn(
      "even:bg-neutral-400/10 odd:bg-neutral-400/5 text-xs",
      "hover:bg-neutral-400/5 active:bg-green-500/25 transition-all cursor-pointer",
      highlight &&
        "even:bg-green-500/25 odd:bg-green-500/25 hover:bg-green-500/50",
    );
  }, []);

  // const { data, idx, onItemClick, breakpoints } = props;
  // const { name, steps } = data;
  // TODO beautify steps
  // const stepString = steps.length === 0 ? '' : toStepString(steps);

  return (
    <>
      <tr className={className} onClick={() => /* onItemClick(idx) */ {}}>
        <td className="py-1 border-r text-center">{props.idx}</td>
        <td className="border-r text-center text-wrap break-all">
          {props.type}
        </td>
        <td className="">
          <button
            className="size-full flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setExpand(expand => !expand);
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
            <Address address={props.address} singleMode />
          </td>
        </tr>
      )}
    </>
  );
}
