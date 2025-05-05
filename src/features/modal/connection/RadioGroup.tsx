import { Radio, RadioGroup } from "@headlessui/react";
import { CheckSquareIcon } from "lucide-react";
import React, { type SetStateAction, type Dispatch } from "react";

interface Props<T> {
  selected: T;
  options: T[];
  setSelected: Dispatch<SetStateAction<T>>;
  getId: (t: T) => string | number;
  getIcon: (t: T) => React.ReactElement<SVGElement>;
  getLabel: (t: T) => string;
  getDescription: (t: T) => React.ReactElement<HTMLParagraphElement>;
}

export default function RadioGroupExample<T>({
  selected,
  options,
  setSelected,
  getId,
  getIcon,
  getLabel,
  getDescription,
}: Props<T>) {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup
          value={selected}
          onChange={setSelected}
          aria-label="Server size"
          className="space-y-2"
        >
          {options.map(o => (
            <Radio
              key={getId(o)}
              value={o}
              className="group hover:scale-[1.03125] active:scale-95 relative flex cursor-pointer rounded-lg bg-neutral-500/10 py-4 px-5 transition
              focus:outline-hidden data-focus:outline-1 data-focus:outline-es-900 data-checked:bg-linear-to-r data-checked:from-es-500/60 dark:data-checked:from-es-900/60 data-checked:to-es-500/5 dark:data-checked:to-es-900/5"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col text-sm gap-2">
                  <header className="[&>svg]:inline-block items-center font-600 text-base">
                    {getIcon(o)} {getLabel(o)}
                  </header>
                  {getDescription(o)}
                </div>
                <div className="min-w-6">
                  <CheckSquareIcon className="size-6 opacity-0 transition group-data-checked:opacity-100" />
                </div>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
