import type { ReactNode } from "react";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { useSelector } from "react-redux";

// State viewer item
interface StateViewerItemProps {
  header: string;
  children?: ReactNode;
}

const selector = (st: ReduxState) => ({
  disabled: !(
    st.appState.state === AppState.DEBUG_READY_AT_FRONT ||
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
});

export default function StateViewerItem(props: StateViewerItemProps) {
  const { header, children } = props;
  const { disabled } = useSelector(selector);

  return (
    <Card>
      <CardHeader title={header} />
      <div className="relative size-full overflow-y-scroll">
        {disabled ? (
          <p className="text-neutral-600">Disabled. Start debugger to use.</p>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
