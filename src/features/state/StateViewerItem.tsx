import type { ReactElement, ReactNode } from "react";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { SuspenseBoundary } from "@/components/primitives/suspense-boundary";

// State viewer item
interface StateViewerItemProps {
  header: string;
  headerItems?: ReactNode;
  children?: ReactNode;
  icon?: ReactElement<SVGElement>;
}

export default function StateViewerItem(props: StateViewerItemProps) {
  const { header, children, headerItems, icon } = props;

  return (
    <Card className="rounded-none border-b">
      <CardHeader icon={icon ?? null} title={header}>
        {headerItems}
      </CardHeader>
      <SuspenseBoundary
        recoverable
        loading={
          <div className="size-full flex items-center justify-center">
            Loading... {import.meta.url}
          </div>
        }
      >
        <div className="relative size-full overflow-y-scroll ">{children}</div>
      </SuspenseBoundary>
    </Card>
  );
}
