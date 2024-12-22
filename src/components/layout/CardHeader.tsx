import { GripIcon } from "lucide-react";
import { type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
}

export default function CardHeader({title, children}: Props) {
  return <header className="flex flex-row justify-between py-2 px-4 rounded-xl overflow-hidden">
    <h3 className="text-xl font-600 text-neutral-600 flex flex-row items-center justify-start gap-1">
      <GripIcon className="inline" size={18} />
      {title}
    </h3>
    {children}
  </header>;
}