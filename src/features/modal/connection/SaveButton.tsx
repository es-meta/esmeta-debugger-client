import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";

interface SaveOption {
  id: "params" | "storage";
  name: string;
}

export const opts: SaveOption[] = [
  { id: "params", name: "Save for this Tab (Requires Refresh)" },
  // { id: "storage", name: "Save for This Browser (Requires Refresh)" },
];

interface Props {
  value: SaveOption;
  setValue: Dispatch<SetStateAction<SaveOption>>;
}

function Example({ value, setValue }: Props) {
  return (
    <Listbox value={value} onChange={setValue}>
      <ListboxButton className="relative size-8 rounded-r-lg bg-es-100 hover:bg-es-200 active:scale-95 transition-all">
        <ChevronDownIcon
          size={16}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className="mt-2 text-xs  bg-white shadow-lg rounded-lg"
      >
        {opts.map(opt => (
          <ListboxOption
            key={opt.id}
            value={opt}
            className="group px-3 py-2 transition-all duration-75 even:bg-neutral-50 cursor-pointer data-[focus]:bg-blue-100 active:scale-95 rounded-lg"
          >
            <CheckIcon
              size={16}
              className="group-data-[selected]:opacity-100 inline-block mr-2 opacity-0 text-blue-500"
            />
            {opt.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

interface MainProps {
  value: SaveOption;
  setValue: Dispatch<SetStateAction<SaveOption>>;
  save: (to: "params" | "storage") => void;
}

export default function SaveButton({ value, setValue, save }: MainProps) {
  const handleClick = useCallback(() => {
    save(value.id);
  }, [save, value.id]);

  return (
    <div className="flex gap-[1px]">
      <button
        className="h-8 px-3 text-xs rounded-l-lg bg-es-100 font-500 hover:bg-es-200 active:scale-95 transition-all"
        onClick={handleClick}
      >
        {value.name}
      </button>
      <Example value={value} setValue={setValue} />
    </div>
  );
}
