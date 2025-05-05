import { Radio, RadioGroup } from "@headlessui/react";
import React from "react";
import { ViewerItem } from "./vieweritems";
import { useAppSelector } from "@/hooks";

interface Props<T> {
  selected: T;
  options: T[];
  setSelected: (t: T) => void;
  getId: (t: T) => string | number;
  getIcon: (t: T) => React.ReactElement<SVGElement>;
  getLabel: (t: T) => string;
}

export default function StateViewerSelect<T extends ViewerItem>({
  selected,
  options,
  setSelected,
  getId,
  getIcon,
  getLabel,
}: Props<T>) {
  const devMode = useAppSelector(st => st.appState.devMode);

  return (
    <RadioGroup
      value={selected}
      onChange={setSelected}
      className="absolute right-0 h-6 mr-1 flex flex-row gap-1 text-xs bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
      aria-label="State Viewer Select"
    >
      {options.map(o =>
        devMode || !o.devOnly ? (
          <Radio
            key={getId(o)}
            value={o}
            className="cursor-pointer
          data-[checked]:bg-es-600 data-[checked]:text-white
          hover:bg-neutral-300 hover:dark:bg-neutral-700 active:scale-90 transition-all [&>svg]:size-4 font-600 flex flex-row justify-center items-center px-1 gap-1 rounded-lg"
          >
            {getIcon(o)}
            {getLabel(o)}
          </Radio>
        ) : null,
      )}
    </RadioGroup>
  );
}
