import { type ReactElement, lazy } from "react";
import type { ExtractAtomValue } from "jotai";
import type { clientActiveViewerAtom } from "@/atoms/defs/client";
const Breakpoints = lazy(() => import("./breakpoint/Breakpoints"));
const EnvViewer = lazy(() => import("./env/EnvViewer"));
const HeapViewer = lazy(() => import("./heap/HeapViewer"));
const CallStackViewer = lazy(
  () => import("./callstack-visited/CallStackViewer"),
);
const InternalStatViewer = lazy(() => import("./internal/InternalStatViewer"));

import {
  ContainerIcon,
  FlagIcon,
  LayersIcon,
  MemoryStickIcon,
  OctagonXIcon,
} from "lucide-react";

export interface ViewerItem {
  name: string;
  id: ExtractAtomValue<typeof clientActiveViewerAtom>;
  icon: ReactElement<SVGElement>;
  view: ReturnType<typeof lazy>;
  devOnly: boolean;
}

export const viewerItems: ViewerItem[] = [
  {
    name: "Env",
    id: "env",
    icon: <ContainerIcon />,
    view: EnvViewer,
    devOnly: false,
  },
  {
    name: "Heap",
    id: "heap",
    icon: <MemoryStickIcon />,
    view: HeapViewer,
    devOnly: false,
  },
  {
    name: "Breaks",
    id: "bp",
    icon: <OctagonXIcon />,
    view: Breakpoints,
    devOnly: false,
  },
  {
    name: "Callstack",
    id: "callstack",
    icon: <LayersIcon />,
    view: CallStackViewer,
    devOnly: false,
  },
  {
    name: "Meta",
    id: "stats",
    icon: <FlagIcon />,
    view: InternalStatViewer,
    devOnly: true,
  },
];
