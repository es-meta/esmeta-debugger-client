import type { ReactNode } from "react";
interface Props {
  label: ReactNode;
  children: React.ReactNode[];
}

export default function ToolbarButtonGroup({ children }: Props) {
  return children;
}
