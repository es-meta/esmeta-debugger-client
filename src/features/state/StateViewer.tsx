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
import { useState } from "react";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { useSelector } from "react-redux";
import StateViewerSelect from "./StateViewerSelect";

const selector = (st: ReduxState) => ({
  disabled: !(
    st.appState.state === AppState.DEBUG_READY_AT_FRONT ||
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
});

const shows = [
  { name: "Heap", icon: <MemoryStickIcon />, view: <HeapViewer /> },
  { name: "Env", icon: <ContainerIcon />, view: <SpecEnvViewer /> },
  { name: "Break", icon: <OctagonXIcon />, view: <Breakpoints /> },
  {
    name: "Callstack",
    icon: <LayersIcon />,
    view: <CallStackViewerWithVisited />,
  },
];

export default function StateViewer() {
  const [collapsed, setCollapsed] = useState(false);
  const [show, setShow] = useState(shows[0]);

  const { disabled } = useSelector(selector);

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
          selected={show}
          options={shows}
          setSelected={setShow}
          getId={s => s.name}
          getIcon={s => s.icon}
          getLabel={s => s.name}
        />
      </CardHeader>
      {disabled ? (
        <p className="text-neutral-500 p-2">Disabled. Start debugger to use.</p>
      ) : (
        show.view
      )}
    </Card>
  );
}
