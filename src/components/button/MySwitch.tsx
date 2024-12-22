import { Switch } from '@headlessui/react'


interface Props {
  checked: boolean
  onChange: (value: boolean) => void
}

export default function MySwitch({ checked, onChange }: Props) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
    </Switch>
  )
}