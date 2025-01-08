import { Radio, RadioGroup } from "@headlessui/react";
import React, { type SetStateAction, type Dispatch } from "react";

interface Props<T> {
  selected: T;
  options: T[];
  setSelected: Dispatch<SetStateAction<T>>;
  getId: (t: T) => string | number;
  getIcon: (t: T) => React.ReactElement<SVGElement>;
  getLabel: (t: T) => string;
}

export default function StateViewerSelect<T>({
  selected,
  options,
  setSelected,
  getId,
  getIcon,
  getLabel,
}: Props<T>) {
  return (
    <RadioGroup
      value={selected}
      onChange={setSelected}
      className="absolute right-0 bg-white h-6 mr-1 flex flex-row gap-1 text-xs text-neutral-500 overflow-scroll"
      aria-label="State Viewer Select"
    >
      {options.map(o => (
        <Radio
          key={getId(o)}
          value={o}
          className="cursor-pointer
          data-[checked]:bg-es-600 data-[checked]:text-white
          hover:bg-neutral-200 active:scale-90 transition-all [&>svg]:size-4 font-600 flex flex-row justify-center items-center px-1 gap-1 rounded-lg"
        >
          {getIcon(o)}
          {getLabel(o)}
        </Radio>
      ))}
    </RadioGroup>
  );
}
