import { GripIcon } from "lucide-react";
import { type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
}

export default function CardHeader({ title, children }: Props) {
  return (
    <header className="flex flex-row justify-between py-1 px-1 rounded-xl h-8 min-h-8 overflow-hidden">
      <h3 className="drag-handle origin-left group hover:bg-neutral-200 px-1 rounded-lg active:scale-90 transition-all cursor-pointer text-sm font-500 text-neutral-600 flex flex-row items-center justify-start gap-1 line-clamp-1">
        <GripIcon className="inline" size={14} />
        {title}
      </h3>
      {children}
    </header>
  );
}
