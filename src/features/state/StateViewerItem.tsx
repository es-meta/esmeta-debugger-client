import type { ReactNode } from "react";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

// State viewer item
interface StateViewerItemProps {
  header: string;
  children?: ReactNode;
}

export default function StateViewerItem(props: StateViewerItemProps) {
  const { header, children } = props;

  return (
    <Card className="bg-neutral-100 rounded-none">
      <CardHeader title={header} />
      <div className="relative size-full overflow-y-scroll">
        {children}
      </div>
    </Card>
  );
}
