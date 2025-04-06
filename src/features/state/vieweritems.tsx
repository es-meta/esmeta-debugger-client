import Breakpoints from "./breakpoint/Breakpoints";
import EnvViewer from "./env/EnvViewer";
import HeapViewer from "./heap/HeapViewer";
import {
  ContainerIcon,
  FlagIcon,
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
  display: boolean;
}

export const viewerItems: ViewerItem[] = [
  {
    name: "Env",
    id: "env",
    icon: <ContainerIcon />,
    view: <EnvViewer />,
    display: true,
  },
  {
    name: "Heap",
    id: "heap",
    icon: <MemoryStickIcon />,
    view: <HeapViewer />,
    display: true,
  },
  {
    name: "Breaks",
    id: "bp",
    icon: <OctagonXIcon />,
    view: <Breakpoints />,
    display: true,
  },
  {
    name: "Callstack",
    id: "callstack",
    icon: <LayersIcon />,
    view: <CallStackViewer />,
    display: true,
  },
  {
    name: "Meta",
    id: "stats",
    icon: <FlagIcon />,
    view: <InternalStatViewer />,
    display: import.meta.env.DEV,
  },
];
