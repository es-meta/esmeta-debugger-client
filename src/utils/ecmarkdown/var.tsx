import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { twJoin } from "tailwind-merge";

// TODO highlight var per context / algo
const highlightVarAtom = atom<string[]>([]);

export function Var({ value }: { value: string }) {
  const [highlightVar, setHighlightVar] = useAtom(highlightVarAtom);

  const className = twJoin(
    highlightVar.includes(value)
      ? classMap[simpleHash(value) % classMap.length] +
          " text-black dark:text-white"
      : "text-[#2aa198]",
    "cursor-pointer rounded px-1 py-0.5",
    "transition-colors ",
  );

  const onClick = useCallback(() => {
    setHighlightVar(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  }, []);

  return (
    <var className={className} onClick={onClick} data-algo-var={value}>
      {value}
    </var>
  );
}

const classMap = [
  "bg-red-100 dark:bg-red-700",
  "bg-rose-100 dark:bg-rose-700",
  "bg-pink-100 dark:bg-pink-700",
  "bg-fuchsia-100 dark:bg-fuchsia-700",
  "bg-orange-100 dark:bg-orange-700",
  "bg-yellow-100 dark:bg-yellow-700",
  "bg-amber-100 dark:bg-amber-700",
  "bg-lime-100 dark:bg-lime-700",
  "bg-emerald-100 dark:bg-emerald-700",
  "bg-teal-100 dark:bg-teal-700",
  "bg-sky-100 dark:bg-sky-700",
  "bg-green-100 dark:bg-green-700",
  "bg-blue-100 dark:bg-blue-700",
  "bg-indigo-100 dark:bg-indigo-700",
  "bg-purple-100 dark:bg-purple-700",
  "bg-violet-100 dark:bg-violet-700",
];

function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i); // XOR is slightly better than +
  }
  return Math.abs(hash);
}
