import { Heap } from "@/types";
import type { Command, CommandObjJotai } from "./types";
// import {
//   irStepAction,
//   irStepOutAction,
//   irStepOverAction,
//   runAction,
//   specStepAction,
//   specStepOutAction,
//   specStepOverAction,
// } from "@/actions";
import { atom } from "jotai";
import { atoms } from "@/atoms";
import {
  irStepAction,
  irStepOutAction,
  irStepOverAction,
  runAction,
  specStepAction,
  specStepOutAction,
  specStepOverAction,
} from "@/actions";

export function fromAtom(atom: CommandObjJotai["atom"]): CommandObjJotai {
  return {
    type: "atom",
    atom,
  };
}

export function computeFiltered(
  heap: Heap,
  query: string,
  map: string[],
): Command[] {
  // if (query.trimEnd() === "?") {
  //   return [
  //     {
  //       label: "use # to search address. use ! to search break points.",
  //       searchTarget: "",
  //       target: null,
  //     },
  //   ];
  // }

  // if (query.startsWith("#")) {
  //   const addrQuery = query.slice(1);
  //   const heapAddrs = Object.getOwnPropertyNames(heap);

  //   return fuzzyFilter(heapAddrs, addrQuery, 0.2, c => c).map(addr => ({
  //     label: `inspect: ${addr}`,
  //     searchTarget: "",
  //     target: null,
  //   }));
  // }

  // if (query.startsWith("!")) {
  //   const breakpointSearchQuery = query.slice(1);
  //   // const bpMap = st.breakpoint.items
  //   const algoNames = Object.getOwnPropertyNames(map);
  //   return fuzzyFilter(algoNames, breakpointSearchQuery, 0.2, c => c).map(
  //     name => ({
  //       label: `toggle: ${name}`,
  //       searchTarget: "",
  //       target: null,
  //     }),
  //   );
  // }

  // if (query.startsWith("@")) {
  //   const envSearchQuery = query.slice(1);
  //   return fuzzyFilter(choose, envSearchQuery, 0, c => c.searchTarget);
  // }

  // if (query.startsWith("/")) {
  //   const cmdSearchQuery = query.slice(1);
  //   return fuzzyFilter(debugAction, cmdSearchQuery, 0, c => c.label);
  // }

  const remaining = query.substring(1);

  const split = remaining.substring(0, remaining.length - 1);
  const lastChar = remaining[remaining.length - 1];
  const repeat = Number(split);

  if (!Number.isNaN(repeat) && repeat > 0) {
    return [
      {
        label: "Send Input: " + lastChar + " " + split + " times",
        searchTarget: "",
        target: {
          type: "func",
          func: () => {
            for (let i = 0; i < repeat; i++) {
              document.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: lastChar, // 눌린 키
                  bubbles: true, // 이벤트 버블링 여부
                  cancelable: true, // 이벤트 취소 가능 여부
                }),
              );
            }
          },
        },
      },
    ] satisfies Command[];
  }

  return [
    {
      label: "Send Input: " + remaining,
      searchTarget: "",
      target: {
        type: "func",
        func: () => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: remaining, // 눌린 키
              bubbles: true, // 이벤트 버블링 여부
              cancelable: true, // 이벤트 취소 가능 여부
            }),
          );
        },
      },
    },
  ] satisfies Command[]; // TODO: remove this
}

// return query === ""
//   ? values
//   : fuzzyFilter(
//     values,
//     query.replace(" ", ""),
//     0.2,
//     c => c.searchTarget,
//   );

const choose: Command[] = [
  {
    label: "See: Breakpoints",
    searchTarget: "breakpoints bp breakpoint break",
    target: fromAtom(
      atom(
        null,
        (get, set) => void set(atoms.client.clientActiveViewerAtom, "bp"),
      ),
    ),
  },
  {
    label: "See: Call Stack",
    searchTarget: "callstack stack cs",
    target: fromAtom(
      atom(
        null,
        (get, set) =>
          void set(atoms.client.clientActiveViewerAtom, "callstack"),
      ),
    ),
  },
  {
    label: "See: Heap",
    searchTarget: "heap",
    target: fromAtom(
      atom(
        null,
        (get, set) => void set(atoms.client.clientActiveViewerAtom, "heap"),
      ),
    ),
  },
  {
    label: "See: Environment",
    searchTarget: "environment env",
    target: fromAtom(
      atom(
        null,
        (get, set) => void set(atoms.client.clientActiveViewerAtom, "env"),
      ),
    ),
  },
  {
    label: "See: Statistics (for debugging)",
    searchTarget: "satistics stats debug",
    target: fromAtom(
      atom(
        null,
        (get, set) => void set(atoms.client.clientActiveViewerAtom, "stats"),
      ),
    ),
  },
];

const debugAction: Command[] = [
  {
    label: "Action: Run Javascript",
    searchTarget: "run",
    target: fromAtom(runAction),
  },
  {
    label: "Action: Spec Step",
    searchTarget: "spec step",
    target: fromAtom(specStepAction),
  },
  {
    label: "Action: Spec Step Over",
    searchTarget: "spec step over",
    target: fromAtom(specStepOverAction),
  },
  {
    label: "Action: Spec Step Out",
    searchTarget: "spec step out",
    target: fromAtom(specStepOutAction),
  },
  {
    label: "Action: IR Step",
    searchTarget: "ir step",
    target: fromAtom(irStepAction),
  },
  {
    label: "Action: IR Step Over",
    searchTarget: "ir step over",
    target: fromAtom(irStepOverAction),
  },
  {
    label: "Action: IR Step Out",
    searchTarget: "ir step out",
    target: fromAtom(irStepOutAction),
  },
];
