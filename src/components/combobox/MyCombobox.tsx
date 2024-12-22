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
  value: string;
  onChange: (value: string) => void;
}

export default function MyCombobox({ values, value, onChange }: ComboProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      query === "" ? values : fuzzyFilter(values, query.replace(" ", ""), 0.2),
    [query, values],
  );

  return (
    <Combobox
      immediate
      as="div"
      className="relative size-full"
      virtual={{ options: filtered }}
      value={value}
      onChange={value => onChange(value || "")}
    >
      <ComboboxInput
        className="w-full p-2 border rounded-lg focus:border focus:border-blue-300 focus:outline-none"
        onChange={event => setQuery(event.target.value)}
      />

      {
        <ComboboxOptions
          transition
          anchor="bottom"
          className="z-[1] w-[var(--input-width)] origin-top border transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 h-32 overflow-scroll bg-white rounded-lg"
        >
          {({ option: name }) => (
            <ComboboxOption key={name} value={name} as={Fragment}>
              {({ focus }) => (
                <li
                  className={twJoin(
                    focus ? "bg-blue-200" : "bg-white",
                    "p-2 cursor-pointer",
                    "w-full",
                  )}
                >
                  <CheckIcon className="hidden ui-selected:block" />
                  {name}
                </li>
              )}
            </ComboboxOption>
          )}
        </ComboboxOptions>
      }
    </Combobox>
  );
}
