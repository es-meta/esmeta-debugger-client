import type { ReactElement } from "react";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { twJoin } from "tailwind-merge";

// State viewer item
interface StateViewerItemProps {
  disabled: boolean;
  header: string;
  body: ReactElement;
}

export default function StateViewerItem(props: StateViewerItemProps) {
  const { disabled, header, body } = props;
  return (
    <Card>
      <CardHeader title={header} />
      <div className={twJoin("relative size-full overflow-y-scroll")}>
        {body}
      </div>
      {disabled && (
        <div className="absolute top-8 left-0 right-0 bottom-0 bg-white bg-opacity-90 z-1 flex flex-col items-center justify-center">
          <p className="text-neutral-600">Disabled. Start debugger to use.</p>
        </div>
      )}
    </Card>
  );
}
