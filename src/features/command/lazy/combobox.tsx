import { Fragment, Ref, useEffect, useMemo, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn } from "@/utils";
import { CheckIcon } from "lucide-react";
import { type Command } from "./types";
import { useAtomValue } from "jotai";
import { atoms } from "@/atoms";
import { computeFiltered } from "./utils";
interface ComboProps {
  value: Command | null;
  setValue: (value: Command | null) => void;
  ref: Ref<HTMLInputElement>;
  close: () => void;
}

export default function CommandBarCombobox(props: ComboProps) {
  const { value, setValue, ref } = props;
  const [query, setQuery] = useState<string>(":");
  const names = useAtomValue(atoms.spec.funcNamesAtom);
  const heap = useAtomValue(atoms.state.heapAtom);

  const filtered = useMemo(
    () => computeFiltered(heap, query, names),
    [query, heap],
  );

  useEffect(() => {
    if (query === "") {
      props.close();
    }
  }, [query, props.close]);

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
        className="text-sm w-full rounded-lg p-8 focus:outline-hidden bg-white dark:bg-neutral-900"
        value={query}
        onChange={event => setQuery(event.target.value)}
        onKeyDown={event => {
          // additional handling for batch updates
          if (event.key === "Backspace") {
            if (event.currentTarget.value === "") {
              props.close();
            }
          }
        }}
      />
      <ComboboxOptions
        transition
        anchor="top start"
        className="text-sm z-101 w-(--input-width) origin-bottom shadow-lg transition duration-75 ease-out empty:invisible data-closed:scale-95 data-closed:opacity-0 h-48 overflow-scroll rounded-lg bg-white/25 dark:bg-neutral-900/25 backdrop-blur-md"
      >
        {({ option: name }: { option: Command }) => (
          <ComboboxOption key={JSON.stringify(name)} value={name} as={Fragment}>
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
    </Combobox>
  );
}
