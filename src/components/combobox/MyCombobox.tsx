import { useState, useMemo, Fragment } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { fuzzyFilter } from "@/util/fuzzy.util";
import { CheckIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";

interface ComboProps {
  values: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export default function MyCombobox({
  values,
  value,
  onChange,
  placeholder,
}: ComboProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      query === ""
        ? values
        : fuzzyFilter(values, query.replace(" ", ""), 0.2, x => x),
    [query, values],
  );

  return (
    <Combobox
      immediate
      as="div"
      className="relative size-full"
      virtual={{ options: filtered }}
      value={value}
      onChange={value => onChange(value)}
    >
      <ComboboxInput
        placeholder={placeholder}
        className="font-mono text-sm w-full p-2 focus:outline focus:outline-blue-300 focus:dark:outline-blue-800 bg-neutral-50 dark:bg-neutral-900"
        onChange={event => setQuery(event.target.value)}
      />
      <ComboboxOptions
        transition
        anchor="bottom"
        className="font-mono text-sm z-[101] shadow-lg w-[var(--input-width)] origin-top transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 h-96 overflow-scroll rounded-lg"
      >
        {({ option: name }) => (
          <ComboboxOption key={name} value={name} as={Fragment}>
            {({ focus }) => (
              <div
                className={twJoin(
                  focus
                    ? "bg-blue-200 dark:bg-blue-950"
                    : "bg-white dark:bg-neutral-800",
                  "p-2 cursor-pointer w-full",
                )}
                title={name}
              >
                <CheckIcon className="hidden ui-selected:block" />
                {name}
              </div>
            )}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
