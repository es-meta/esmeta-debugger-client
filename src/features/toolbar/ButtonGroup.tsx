import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ToolButtonGroup({ children} : Props) {
  return <div className="flex flex-row justify-start px-[1px]">
    {children}
  </div>
}