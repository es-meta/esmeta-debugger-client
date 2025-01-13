import StateViewerItem from "../StateViewerItem";
import Address, { GuideTooltip } from "@/features/state/heap/Address";
import { useSelector } from "react-redux";

import { ReduxState } from "@/store";
import { EXECUTION_STACK_ADDR } from "@/constants/constant";

export function selector(st: ReduxState): string | null {
  const { heap } = st.irState;
  
  const IS_EMPTY = (!heap || !heap[EXECUTION_STACK_ADDR]);
  
  if (IS_EMPTY) return null;
  // TODO use type defs

  const eStack = heap[EXECUTION_STACK_ADDR];
  if (!eStack || eStack.type !== 'ListObj') return null;

  return eStack.values.at(0) || null;
}

export default function JSEnvViewer() {

  const topEnv = useSelector(selector);

  return (
    <StateViewerItem
      header="JavaScript&nbsp;Environment"
      headerItems={<GuideTooltip />}
    >
      {topEnv ? <Address address={topEnv} singleMode /> : null}
    </StateViewerItem>
  );
}
