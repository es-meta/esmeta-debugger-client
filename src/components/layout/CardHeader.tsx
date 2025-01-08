import { GripIcon } from "lucide-react";
import { ReactElement, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  icon?: ReactElement<SVGElement>;
  title: string;
}

export default function CardHeader({ title, children, icon }: Props) {
  return (
    <header className="flex flex-row justify-between py-1 px-1 rounded-xl h-8 min-h-8 overflow-hidden">
      <h3 className="px-1 rounded-lg transition-all text-sm font-500 text-neutral-600 flex flex-row items-center justify-start gap-1 line-clamp-1 overflow-hidden text-ellipsis">
        {icon ?? <GripIcon className="inline" size={14} />}
        {title}
      </h3>
      {children}
    </header>
  );
}
