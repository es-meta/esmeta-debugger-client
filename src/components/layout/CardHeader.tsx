import { GripIcon } from "lucide-react";
import { ReactElement, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  icon?: ReactElement<SVGElement> | null;
  title: string;
}

export default function CardHeader({ title, children, icon }: Props) {
  return (
    <header className="relative flex flex-row justify-between border-b py-1 px-1 min-h-8">
      <h3 className="px-1 rounded-lg transition-all text-sm font-500 text-neutral-600 flex flex-row items-center justify-start gap-1 line-clamp-1 overflow-hidden text-ellipsis">
        {icon === null
          ? null
          : (icon ?? <GripIcon className="inline" size={14} />)}
        {title}
      </h3>
      {children}
    </header>
  );
}
