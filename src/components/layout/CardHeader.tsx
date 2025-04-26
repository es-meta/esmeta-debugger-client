import { GripIcon } from "lucide-react";
import { ReactElement, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  icon?: ReactElement<SVGElement> | null;
  title: string;
}

export default function CardHeader({ title, children, icon }: Props) {
  return (
    <header className="relative flex flex-row justify-between border-b py-1 px-1 h-8 min-h-8 max-h-8 bg-neutral-50 dark:bg-neutral-800">
      <h3 className="px-1 text-sm font-500 space-x-2 [&>svg]:inline items-center justify-start gap-1 line-clamp-1 overflow-hidden text-ellipsis">
        {icon === null ? null : (icon ?? <GripIcon size={14} />)}
        &nbsp;
        {title}
      </h3>
      {children}
    </header>
  );
}
