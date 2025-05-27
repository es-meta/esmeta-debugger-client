import { Switch as HeadlessSwitch } from "@headlessui/react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange }: Props) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className="group inline-flex py-1 px-3.5 items-center rounded-full transition cursor-pointer data-checked:bg-es-600 bg-neutral-300 dark:bg-neutral-700"
    >
      <span
        className="cursor-pointer size-3 rounded-full bg-white transition-transform duration-300 ease-in-out
          group-data-checked:translate-x-2.5 -translate-x-2.5"
      />
    </HeadlessSwitch>
  );
}
