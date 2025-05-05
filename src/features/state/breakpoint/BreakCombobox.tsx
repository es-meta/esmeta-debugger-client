import { useState, useMemo, Fragment, ReactElement } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn, fuzzyFilter } from "@/utils";
import { IrToSpecMapping } from "@/types";
import { AlgoViewerHeaderUsingOnlyName } from "@/features/spec/algo/AlgoViewerHeader";
import { useAppSelector } from "@/hooks";

interface ComboProps<T> {
  values: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
}

interface Option {
  name: string;
  search: string;
  view: ReactElement;
}

function alternativeName(
  name: string,
  irToSpecMapping: IrToSpecMapping,
): string {
  const specInfo = irToSpecMapping[name];
  if (specInfo?.isBuiltIn) {
    return `${name} ${name.substring("INTRINSICS.".length)}`;
  }
  if (specInfo?.isSdo && specInfo?.sdoInfo && specInfo?.sdoInfo.prod) {
    return `${name} ${specInfo.sdoInfo.method} of ${specInfo.sdoInfo.prod?.astName}`;
  }
  return name;
}

function computeFiltered(values: Option[], query: string): Option[] {
  return fuzzyFilter(values, query.replace(" ", ""), 0.2, x => x.search);
}

export default function MyCombobox({
  values,
  value,
  onChange,
  placeholder,
}: ComboProps<string>) {
  const [query, setQuery] = useState("");

  const irToSpecMapping = useAppSelector(st => st.spec.irToSpecMapping);

  const options = useMemo(
    () =>
      values.map(name => ({
        name,
        search: alternativeName(name, irToSpecMapping),
        view: (
          <AlgoViewerHeaderUsingOnlyName
            name={name}
            irToSpecMapping={irToSpecMapping}
          />
        ),
      })),
    [values, irToSpecMapping],
  );

  const filtered = useMemo(
    () => computeFiltered(options, query),
    [query, values],
  );

  const selectedOption = useMemo(() => {
    return options.find(o => o.name === value);
  }, [value, options]);

  return (
    <Combobox
      immediate
      as="div"
      className="relative size-full"
      virtual={{ options: filtered }}
      value={selectedOption}
      onChange={option => onChange(option?.name ?? null)}
    >
      <ComboboxInput
        placeholder={placeholder}
        onChange={event => setQuery(event.target.value)}
      />
      <ComboboxOptions
        transition
        anchor="bottom"
        className="font-mono text-sm z-101 shadow-lg w-(--input-width) origin-top transition duration-200 ease-out empty:invisible data-closed:scale-95 data-closed:opacity-0 h-96 overflow-scroll rounded-lg"
      >
        {({ option }) => (
          <ComboboxOption key={option.name} value={option} as={Fragment}>
            {({ focus }) => (
              <div
                className={cn(
                  "even:bg-white odd:bg-neutral-50",
                  "dark:even:bg-neutral-800 dark:odd:bg-neutral-900",
                  "p-2 cursor-pointer w-full break-all",
                  focus &&
                    "even:bg-blue-200 odd:bg-blue-200 dark:even:bg-blue-950 dark:odd:bg-blue-950",
                )}
                title={option.name}
              >
                {/* <CheckIcon className="hidden ui-selected:block" /> */}
                {/* {option.view} */}
                {option.view}
              </div>
            )}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
