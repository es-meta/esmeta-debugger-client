import { Fragment, forwardRef, Ref } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn, fuzzyFilter } from "@/utils";
import { CheckIcon } from "lucide-react";
import type { Command } from "./command.types";

interface ComboProps {
  value: Command | null;
  setValue: (value: Command | null) => void;
}

function computeFiltered(get: Getter): Command[] {
  const query = get(queryAtom);
  const { heap, nameMap } = useAppSelector(
    st => ({ heap: st.ir.heap, nameMap: st.spec.nameMap }),
    shallowEqual,
  );

  if (query.trimEnd() === "?") {
    return [
      {
        label: "use # to search address. use ! to search break points.",
        searchTarget: "",
        action: null,
      },
    ];
  }

  if (query.startsWith("#")) {
    const addrQuery = query.slice(1);
    const heapAddrs = Object.getOwnPropertyNames(heap);

    return fuzzyFilter(heapAddrs, addrQuery, 0.2, c => c).map(addr => ({
      label: `inspect: ${addr}`,
      searchTarget: "",
      action: null,
    }));
  }

  if (query.startsWith("!")) {
    const breakpointSearchQuery = query.slice(1);
    // const bpMap = st.breakpoint.items
    const algoNames = Object.getOwnPropertyNames(nameMap);
    return fuzzyFilter(algoNames, breakpointSearchQuery, 0.2, c => c).map(
      name => ({
        label: `toggle: ${name}`,
        searchTarget: "",
        action: null,
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

const queryAtom = atom<string>("");
const filteredAtom = atom<Command[]>(computeFiltered);

export default forwardRef<HTMLInputElement, ComboProps>(
  function CommandBarCombobox(props: ComboProps, ref: Ref<HTMLInputElement>) {
    const { value, setValue } = props;
    const [query, setQuery] = useAtom(queryAtom);
    const filtered = useAtomValue(filteredAtom);

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
          className="text-sm w-full rounded-lg p-4 focus:outline-hidden bg-white dark:bg-neutral-900"
          onChange={event => setQuery(event.target.value)}
          // placeholder="Search command..."
        />
        <ComboboxOptions
          transition
          anchor="bottom"
          className="text-sm z-101 w-(--input-width) origin-top shadow-lg transition duration-200 ease-out empty:invisible data-closed:scale-95 data-closed:opacity-0 h-96 overflow-scroll rounded-lg bg-white dark:bg-neutral-900"
        >
          {({ option: name }: { option: Command }) => (
            <ComboboxOption
              key={JSON.stringify(name)}
              value={name}
              as={Fragment}
            >
              {({ focus }) => (
                <div
                  className={cn(
                    "even:bg-white odd:bg-neutral-50",
                    "dark:even:bg-neutral-900 dark:odd:bg-neutral-800",
                    focus
                      ? "even:bg-blue-300 odd:bg-blue-300 dark:even:bg-blue-900 dark:odd:bg-blue-900"
                      : "",
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
    action: null,
  },
  {
    label: "See: Call Stack",
    searchTarget: "callstack stack cs",
    action: null,
  },
  {
    label: "See: Heap",
    searchTarget: "heap",
    action: null,
  },
  {
    label: "See: Environment",
    searchTarget: "environment env",
    action: null,
  },
  {
    label: "See: Statistics (for debugging)",
    searchTarget: "satistics stats debug",
    action: null,
  },
];

// import {
//   clientActiveAddrAtom,
//   clientActiveViewerAtom,
// } from "@/atoms/defs/client";
import { atom, Getter, useAtom, useAtomValue } from "jotai";
import { shallowEqual, useAppSelector } from "@/hooks";

const debugAction: Command[] = [
  {
    label: "Action: Run Javascript",
    searchTarget: "run",
    action: null, //runThunk(),
  },
  {
    label: "Action: Spec Step",
    searchTarget: "spec step",
    action: null, //stepSpecThunk(),
  },
  {
    label: "Action: Spec Step Over",
    searchTarget: "spec step over",
    action: null, //stepSpecOverThunk(),
  },
  {
    label: "Action: Spec Step Out",
    searchTarget: "spec step out",
    action: null, //stepSpecOutThunk(),
  },
  {
    label: "Action: IR Step",
    searchTarget: "ir step",
    action: null, //stepIrThunk(),
  },
  {
    label: "Action: IR Step Over",
    searchTarget: "ir step over",
    action: null, //stepIrOverThunk(),
  },
  {
    label: "Action: IR Step Out",
    searchTarget: "ir step out",
    action: null, //stepIrOutThunk(),
  },
];
