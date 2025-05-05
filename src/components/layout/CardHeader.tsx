import { ReactElement, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  icon?: ReactElement<SVGElement> | null;
  title: string;
}

export default function CardHeader({ title, children, icon }: Props) {
  return (
    <header className="relative flex flex-row justify-between border-b h-7 min-h-7 max-h-7 items-center bg-neutral-50 dark:bg-neutral-800">
      <h3 className="px-2 text-xs font-600 [&>svg]:inline-block truncate line-clamp-1">
        {icon}
        &nbsp;
        {title}
      </h3>
      {children}
    </header>
  );
}
