import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { CpuIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { useDispatch, useSelector } from "react-redux";
import StateViewerSelect from "./StateViewerSelect";
import { chooseStateViewer } from "@/store/reducers/Client";
import { ViewerItem, viewerItems } from "./vieweritems";

const selector = (st: ReduxState) => ({
  disabled: !(
    st.appState.state === AppState.DEBUG_READY_AT_FRONT ||
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
  targetId: st.client.stateviewer.view,
});

export default function StateViewer() {
  const [collapsed, setCollapsed] = useState(false);
  // const [show, setShow] = useState(shows[0]);
  const dispatch = useDispatch();

  // const ref = useCallback((node: HTMLDivElement | null) => {
  //   // if node === null : unmount

  //   // const observer = new ResizeObserver(() => {

  //   // });

  // },[]);

  const { disabled, targetId } = useSelector(selector);

  const toggle = <div onClick={() => setCollapsed(!collapsed)}>toggle</div>;

  return collapsed ? (
    toggle
  ) : (
    <Card className="flex flex-col size-full">
      <CardHeader
        title="State&nbsp;Viewer"
        icon={<CpuIcon size={14} className="inline" />}
      >
        <StateViewerSelect
          selected={viewerItems.find(s => s.id === targetId) || viewerItems[0]}
          options={viewerItems}
          setSelected={(s: ViewerItem) => {
            if (!s) return;
            dispatch(chooseStateViewer(s.id));
          }}
          getId={s => s.name}
          getIcon={s => s.icon}
          getLabel={s => s.name}
        />
      </CardHeader>
      <div className="overflow-y-scroll size-full">
        {disabled ? (
          <p className="text-neutral-500 p-2">
            Disabled. Start debugger to use.
          </p>
        ) : (
          // temp fix to preserve state in render tree - use redux later
          viewerItems.map(s => (
            <div key={s.name} className={targetId === s.id ? "" : "hidden"}>
              {s.view}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
