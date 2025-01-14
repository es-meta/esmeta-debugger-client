import Breakpoints from "./breakpoint/Breakpoints";
import EnvViewer from "./env/EnvViewer";
import HeapViewer from "./heap/HeapViewer";
import {
  ContainerIcon,
  LayersIcon,
  MemoryStickIcon,
  OctagonXIcon,
} from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { ClientState } from "@/store/reducers/Client";
import InternalStatViewer from "./internal/InternalStatViewer";
import CallStackViewer from "./callstack-visited/CallStackViewer";

export interface ViewerItem {
  name: string;
  id: ClientState["stateviewer"]["view"];
  icon: ReactElement<SVGElement>;
  view: ReactNode;
  hiddenByDefault: boolean;
}

export const viewerItems: ViewerItem[] = [
  {
    name: "Env",
    id: "env",
    icon: <ContainerIcon />,
    view: <EnvViewer />,
    hiddenByDefault: false,
  },
  {
    name: "Heap",
    id: "heap", icon: <MemoryStickIcon />, view: <HeapViewer />,
    hiddenByDefault: false,
  },
  {
    name: "Breaks",
    id: "bp",
    icon: <OctagonXIcon />,
    view: <Breakpoints />,
    hiddenByDefault: false,
  },
  {
    name: "Callstack",
    id: "callstack",
    icon: <LayersIcon />,
    view: <CallStackViewer />,
    hiddenByDefault: false,
  },
  {
    name: "Meta",
    id: "stats",
    icon: <OctagonXIcon />,
    view: <InternalStatViewer />,
    hiddenByDefault: true,
  }
];