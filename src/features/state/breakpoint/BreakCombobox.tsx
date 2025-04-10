import { useState, useMemo, Fragment, ReactNode, ReactElement } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { fuzzyFilter } from "@/util/fuzzy.util";
import { CheckIcon } from "lucide-react";
import { twJoin, twMerge } from "tailwind-merge";
import { shallowEqual, useSelector } from "react-redux";
import { IrToSpecMapping } from "@/store/reducers/Spec";
import { ReduxState } from "@/store";
import { AlgoViewerHeaderUsingOnlyName } from "@/features/spec/algo/AlgoViewerHeader";

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

  const { irToSpecMapping } = useSelector(
    (s: ReduxState) => ({
      irToSpecMapping: s.spec.irToSpecMapping,
    }),
    shallowEqual,
  );

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
        className="font-mono text-sm w-full p-2 focus:outline focus:outline-blue-300 bg-neutral-50"
        onChange={event => setQuery(event.target.value)}
      />
      <ComboboxOptions
        transition
        anchor="bottom"
        className="font-mono text-sm z-[101] shadow-lg w-[var(--input-width)] origin-top border transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 h-96 overflow-scroll bg-white rounded-lg"
      >
        {({ option }) => (
          <ComboboxOption key={option.name} value={option} as={Fragment}>
            {({ focus }) => (
              <div
                className={twMerge(
                  "even:bg-white odd:bg-neutral-50",
                  "p-2 cursor-pointer w-full break-all",
                  focus && "even:bg-blue-200 odd:bg-blue-200",
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
