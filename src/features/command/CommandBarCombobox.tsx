import { Fragment, Ref, useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn } from "@/utils";
import { CheckIcon } from "lucide-react";
import { type Command } from "./command.types";
import { atom, useAtom, useAtomValue } from "jotai";
import { useAppSelector } from "@/hooks";
import { atoms } from "@/atoms";
import { computeFiltered } from "./command.utils";

interface ComboProps {
  value: Command | null;
  setValue: (value: Command | null) => void;
  ref: Ref<HTMLInputElement>;
}

const queryAtom = atom<string>("");

export default function CommandBarCombobox(props: ComboProps) {
  const { value, setValue, ref } = props;
  const [query, setQuery] = useAtom(queryAtom);
  const names = useAtomValue(atoms.spec.irToSpecNameMapAtom);
  const heap = useAppSelector(st => st.ir.heap);

  const filtered = useMemo(
    () => computeFiltered(heap, query, names),
    [query, heap],
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
      {query === "" && (
        <p className="mt-2 text-xs bg-white dark:bg-neutral-900 rounded-lg p-4">
          Press @ to see viewers, # to inspect heap address, / to do trigger
          debugger commands
        </p>
      )}
    </Combobox>
  );
}
