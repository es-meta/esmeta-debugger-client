import type { ReactNode } from "react";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

// State viewer item
interface StateViewerItemProps {
  header: string;
  headerItems?: ReactNode;
  children?: ReactNode;
}

export default function StateViewerItem(props: StateViewerItemProps) {
  const { header, children, headerItems } = props;

  return (
    <Card className="bg-white rounded-none">
      <CardHeader title={header}>{headerItems}</CardHeader>
      <div className="relative size-full overflow-y-scroll bg-white">
        {children}
      </div>
    </Card>
  );
}
