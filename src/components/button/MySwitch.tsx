import { Switch } from "@headlessui/react";

interface Props {
  checked: boolean;
  onChange: () => void;
}

export default function MySwitch({ checked, onChange }: Props) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`group inline-flex py-1 px-3.5 items-center rounded-full transition cursor-pointer ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`cursor-pointer size-3 rounded-full bg-white transition-transform duration-300 ease-in-out ${
          checked ? "translate-x-2.5" : "-translate-x-2.5"
        }`}
      />
    </Switch>
  );
}
