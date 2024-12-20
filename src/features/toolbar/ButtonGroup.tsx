import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ToolButtonGroup({ children }: Props) {
  return (
    <div className="flex flex-row flex-wrap justify-start pr-[1px] *:-mr-[1px]">
      {children}
    </div>
  );
}
