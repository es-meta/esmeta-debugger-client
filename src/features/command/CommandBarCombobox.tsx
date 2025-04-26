import { useState, useMemo, Fragment, forwardRef, Ref, Dispatch } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { fuzzyFilter } from "@/util/fuzzy.util";
import { CheckIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import type { Command } from "./command.type";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { toggleBreak } from "@/store/reducers/Breakpoint";
import { chooseStateViewer, setHeapViewerAddr } from "@/store/reducers/Client";

interface ComboProps {
  value: Command | null;
  setValue: (value: Command | null) => void;
}

function computeFiltered(query: string, st: ReduxState): Command[] {
  if (query.trimEnd() === "?") {
    return [
      {
        label: "use # to search address. use ! to search break points.",
        searchTarget: "",
        actions: [],
      },
    ];
  }

  if (query.startsWith("#")) {
    const addrQuery = query.slice(1);
    const heapAddrs = Object.getOwnPropertyNames(st.irState.heap);

    return fuzzyFilter(heapAddrs, addrQuery, 0.2, c => c).map(addr => ({
      label: `inspect: ${addr}`,
      searchTarget: "",
      actions: [setHeapViewerAddr(addr), chooseStateViewer("heap")],
    }));
  }

  if (query.startsWith("!")) {
    const breakpointSearchQuery = query.slice(1);
    // const bpMap = st.breakpoint.items
    const algoNames = Object.getOwnPropertyNames(st.spec.nameMap);
    return fuzzyFilter(algoNames, breakpointSearchQuery, 0.2, c => c).map(
      name => ({
        label: `toggle: ${name}`,
        searchTarget: "",
        actions: [toggleBreak(name)],
      }),
    );
  }

  if (query.startsWith("@")) {
    const envSearchQuery = query.slice(1);
    return fuzzyFilter(choose, envSearchQuery, 0, c => c.searchTarget);
  }

  if (query.startsWith("/")) {
    const cmdSearchQuery = query.slice(1);
    return fuzzyFilter(debugActions, cmdSearchQuery, 0, c => c.label);
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

export default forwardRef<HTMLInputElement, ComboProps>(
  function CommandBarCombobox(props: ComboProps, ref: Ref<HTMLInputElement>) {
    const { value, setValue } = props;
    const [query, setQuery] = useState("");

    const st = useSelector((st: ReduxState) => st);

    const filtered: Command[] = useMemo(
      () => computeFiltered(query, st),
      [query, st],
    );

    return (
      <Combobox<Command>
        immediate
        virtual={{ options: filtered }}
        value={value || undefined}
        onChange={value => setValue(value || null)}
      >
        <ComboboxInput
          ref={ref}
          autoFocus
          className="text-sm w-full rounded-lg p-4 focus:outline-none bg-white dark:bg-neutral-900"
          onChange={event => setQuery(event.target.value)}
          // placeholder="Search command..."
        />
        <ComboboxOptions
          transition
          anchor="bottom"
          className="text-sm z-[101] w-[var(--input-width)] origin-top shadow-lg transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 h-96 overflow-scroll rounded-lg bg-white dark:bg-neutral-900"
        >
          {({ option: name }: { option: Command }) => (
            <ComboboxOption
              key={JSON.stringify(name)}
              value={name}
              as={Fragment}
            >
              {({ focus }) => (
                <div
                  className={twMerge(
                    "even:bg-white odd:bg-neutral-50",
                    "dark:even:bg-neutral-900 dark:odd:bg-neutral-800",
                    focus ? "even:bg-blue-300 odd:bg-blue-300 even:dark:bg-blue-900 odd:dark:bg-blue-900" : "",
                    "p-2 cursor-pointer w-full",
                  )}
                  title={JSON.stringify(name)}
                >
                  <CheckIcon className="hidden ui-selected:block" />
                  {name.label}
                </div>
              )}
            </ComboboxOption>
          )}
        </ComboboxOptions>
        {query === "" && (
          <p className="mt-2 text-xs bg-white dark:bg-neutral-900 rounded-lg p-4">
            Press @ to see viewers, # to inspect heap address, / to do trigger
            debugger commands
          </p>
        )}
      </Combobox>
    );
  },
);

//////////////// constants ////////////////

const choose: Command[] = [
  {
    label: "See: Breakpoints",
    searchTarget: "breakpoints bp breakpoint break",
    actions: [chooseStateViewer("bp")],
  },
  {
    label: "See: Call Stack",
    searchTarget: "callstack stack cs",
    actions: [chooseStateViewer("callstack")],
  },
  {
    label: "See: Heap",
    searchTarget: "heap",
    actions: [chooseStateViewer("heap")],
  },
  {
    label: "See: Environment",
    searchTarget: "environment env",
    actions: [chooseStateViewer("env")],
  },
  {
    label: "See: Statistics (for debugging)",
    searchTarget: "satistics stats debug",
    actions: [chooseStateViewer("stats")],
  },
];

import {
  irStep,
  irStepOut,
  irStepOver,
  run,
  specStep,
  specStepOut,
  specStepOver,
} from "@/store/reducers/Debugger";

const debugActions: Command[] = [
  {
    label: "Action: Run Javascript",
    searchTarget: "run",
    actions: [run()],
  },
  {
    label: "Action: Spec Step",
    searchTarget: "spec step",
    actions: [specStep()],
  },
  {
    label: "Action: Spec Step Over",
    searchTarget: "spec step over",
    actions: [specStepOver()],
  },
  {
    label: "Action: Spec Step Out",
    searchTarget: "spec step out",
    actions: [specStepOut()],
  },
  {
    label: "Action: IR Step",
    searchTarget: "ir step",
    actions: [irStep()],
  },
  {
    label: "Action: IR Step Over",
    searchTarget: "ir step over",
    actions: [irStepOver()],
  },
  {
    label: "Action: IR Step Out",
    searchTarget: "ir step out",
    actions: [irStepOut()],
  },
];
