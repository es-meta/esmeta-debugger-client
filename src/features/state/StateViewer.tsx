import Card from "@/components/layout/Card";
import Breakpoints from "./breakpoint/Breakpoints";
import CallStackViewerWithVisited from "./callstack-visited/CallStackViewerWithVisited";
import SpecEnvViewer from "./env/SpecEnvViewer";
import HeapViewer from "./heap/HeapViewer";
import CardHeader from "@/components/layout/CardHeader";
import {
  ContainerIcon,
  CpuIcon,
  LayersIcon,
  MemoryStickIcon,
  OctagonXIcon,
} from "lucide-react";
import { ReactElement, ReactNode, useState } from "react";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { useDispatch, useSelector } from "react-redux";
import StateViewerSelect from "./StateViewerSelect";
import { chooseStateViewer, ClientState } from "@/store/reducers/Client";

const selector = (st: ReduxState) => ({
  disabled: !(
    st.appState.state === AppState.DEBUG_READY_AT_FRONT ||
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
  targetId: st.client.stateviewer.view,
});

interface Show {
  name: string;
  id: ClientState["stateviewer"]["view"];
  icon: ReactElement<SVGElement>;
  view: ReactNode;
}

const shows: Show[] = [
  {
    name: "Envrironment",
    id: "env",
    icon: <ContainerIcon />,
    view: <SpecEnvViewer />,
  },
  { name: "Heap", id: "heap", icon: <MemoryStickIcon />, view: <HeapViewer /> },
  {
    name: "Breakpoint",
    id: "bp",
    icon: <OctagonXIcon />,
    view: <Breakpoints />,
  },
  {
    name: "Callstack",
    id: "callstack",
    icon: <LayersIcon />,
    view: <CallStackViewerWithVisited />,
  },
];

export default function StateViewer() {
  const [collapsed, setCollapsed] = useState(false);
  // const [show, setShow] = useState(shows[0]);
  const dispatch = useDispatch();

  const { disabled, targetId } = useSelector(selector);

  const toggle = <div onClick={() => setCollapsed(!collapsed)}>toggle</div>;

  return collapsed ? (
    toggle
  ) : (
    <Card>
      <CardHeader
        title="State&nbsp;Viewer"
        icon={<CpuIcon size={14} className="inline" />}
      >
        <StateViewerSelect
          selected={shows.find(s => s.id === targetId) || shows[0]}
          options={shows}
          setSelected={(s: Show) => {
            if (!s) return;
            dispatch(chooseStateViewer(s.id));
          }}
          getId={s => s.name}
          getIcon={s => s.icon}
          getLabel={s => s.name}
        />
      </CardHeader>
      {disabled ? (
        <p className="text-neutral-500 p-2">Disabled. Start debugger to use.</p>
      ) : (
        // temp fix to preserve state in render tree - use redux later
        shows.map(s => (
          <div key={s.name} className={targetId === s.id ? "" : "hidden"}>
            {s.view}
          </div>
        ))
      )}
    </Card>
  );
}
