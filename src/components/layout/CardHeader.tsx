import {
  Dispatch,
  SetStateAction,
  ReactElement,
  type PropsWithChildren,
} from "react";

interface Props extends PropsWithChildren {
  icon?: ReactElement<SVGElement> | null;
  title: string;
}

export default function CardHeader({ title, children, icon }: Props) {
  return (
    <header className="relative flex flex-row justify-between border-b h-7 min-h-7 max-h-7 items-center bg-neutral-50 dark:bg-neutral-800">
      <h3 className="px-2 text-xs font-500 [&>svg]:inline-block truncate line-clamp-1">
        {icon}
        &nbsp;
        {title}
      </h3>
      {children}
    </header>
  );
}

interface PropsMultiple<T extends string> extends PropsWithChildren {
  icon?: ReactElement<SVGElement> | null;
  titles: readonly T[];
  title: T;
  onSelect: Dispatch<T> | Dispatch<SetStateAction<T>>;
}

export function CardHeaderMultiple<T extends string>({
  title: selected,
  titles,
  children,
  icon,
  onSelect,
}: PropsMultiple<T>) {
  return (
    <header className="relative flex flex-row justify-between border-b h-7 min-h-7 max-h-7 items-center bg-neutral-50 dark:bg-neutral-800">
      <h3 className="inline-flex  items-center px-2 text-xs font-500 [&>svg]:inline-block ">
        {icon}
        &nbsp;
        <div>
          <select
            className="inline-block w-full"
            onChange={e => {
              const selectedIndex = Number(e.currentTarget.value);
              onSelect(titles[selectedIndex]);
            }}
          >
            {titles.map((title, index) => (
              <option key={index} value={index} selected={title === selected}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </h3>
      {children}
    </header>
  );
}
