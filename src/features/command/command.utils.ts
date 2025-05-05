import { Heap } from "@/types";
import { fuzzyFilter } from "@/utils";
import type {
  Command,
  CommandObjJotai,
  CommandObjRedux,
} from "./command.types";
import {
  irStepAction,
  irStepOutAction,
  irStepOverAction,
  runAction,
  specStepAction,
  specStepOutAction,
  specStepOverAction,
} from "@/actions";
import { atom } from "jotai";
import { atoms } from "@/atoms";

export function fromAtom(atom: CommandObjJotai["atom"]): CommandObjJotai {
  return {
    type: "atom",
    atom,
  };
}

export function fromRedux(action: CommandObjRedux["action"]): CommandObjRedux {
  return {
    type: "redux",
    action,
  };
}

export function computeFiltered(
  heap: Heap,
  query: string,
  map: Record<string, unknown>,
): Command[] {
  if (query.trimEnd() === "?") {
    return [
      {
        label: "use # to search address. use ! to search break points.",
        searchTarget: "",
        target: null,
      },
    ];
  }

  if (query.startsWith("#")) {
    const addrQuery = query.slice(1);
    const heapAddrs = Object.getOwnPropertyNames(heap);

    return fuzzyFilter(heapAddrs, addrQuery, 0.2, c => c).map(addr => ({
      label: `inspect: ${addr}`,
      searchTarget: "",
      target: null,
    }));
  }

  if (query.startsWith("!")) {
    const breakpointSearchQuery = query.slice(1);
    // const bpMap = st.breakpoint.items
    const algoNames = Object.getOwnPropertyNames(map);
    return fuzzyFilter(algoNames, breakpointSearchQuery, 0.2, c => c).map(
      name => ({
        label: `toggle: ${name}`,
        searchTarget: "",
        target: null,
      }),
    );
  }

  if (query.startsWith("@")) {
    const envSearchQuery = query.slice(1);
    return fuzzyFilter(choose, envSearchQuery, 0, c => c.searchTarget);
  }

  if (query.startsWith("/")) {
    const cmdSearchQuery = query.slice(1);
    return fuzzyFilter(debugAction, cmdSearchQuery, 0, c => c.label);
  }

  return [];

  // return query === ""
  //   ? values
  //   : fuzzyFilter(
  //     values,
  //     query.replace(" ", ""),
  //     0.2,
  //     c => c.searchTarget,
  //   );
}

const choose: Command[] = [
  {
    label: "See: Breakpoints",
    searchTarget: "breakpoints bp breakpoint break",
    target: fromAtom(
      atom(null, (get, set) => set(atoms.client.clientActiveViewerAtom, "bp")),
    ),
  },
  {
    label: "See: Call Stack",
    searchTarget: "callstack stack cs",
    target: fromAtom(
      atom(null, (get, set) =>
        set(atoms.client.clientActiveViewerAtom, "callstack"),
      ),
    ),
  },
  {
    label: "See: Heap",
    searchTarget: "heap",
    target: fromAtom(
      atom(null, (get, set) =>
        set(atoms.client.clientActiveViewerAtom, "heap"),
      ),
    ),
  },
  {
    label: "See: Environment",
    searchTarget: "environment env",
    target: fromAtom(
      atom(null, (get, set) => set(atoms.client.clientActiveViewerAtom, "env")),
    ),
  },
  {
    label: "See: Statistics (for debugging)",
    searchTarget: "satistics stats debug",
    target: fromAtom(
      atom(null, (get, set) =>
        set(atoms.client.clientActiveViewerAtom, "stats"),
      ),
    ),
  },
];

const debugAction: Command[] = [
  {
    label: "Action: Run Javascript",
    searchTarget: "run",
    target: fromRedux(runAction()),
  },
  {
    label: "Action: Spec Step",
    searchTarget: "spec step",
    target: fromRedux(specStepAction()),
  },
  {
    label: "Action: Spec Step Over",
    searchTarget: "spec step over",
    target: fromRedux(specStepOverAction()),
  },
  {
    label: "Action: Spec Step Out",
    searchTarget: "spec step out",
    target: fromRedux(specStepOutAction()),
  },
  {
    label: "Action: IR Step",
    searchTarget: "ir step",
    target: fromRedux(irStepAction()),
  },
  {
    label: "Action: IR Step Over",
    searchTarget: "ir step over",
    target: fromRedux(irStepOverAction()),
  },
  {
    label: "Action: IR Step Out",
    searchTarget: "ir step out",
    target: fromRedux(irStepOutAction()),
  },
];
