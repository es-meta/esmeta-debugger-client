import { useSelector } from "react-redux";
import AlgoViewer from "./algo/AlgoViewer";
import Graphviz from "./Graphviz";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { ReduxState } from "@/store";
// import { LinkIcon, LockIcon, LockOpenIcon } from "lucide-react";
import { useState } from "react";
import SpecVersionView from "./SpecVersionView";

// view type of spec
enum SpecViewType {
  GRAPH,
  ALGORITHM,
  DEFAULT,
}

const selector = (st: ReduxState) => ({
  spec: st.spec,
  irState: st.irState,
  breakpoints: st.breakpoint.items,
});

export default function SpecViewer() {
  // TODO optimize
  const props = useSelector(selector);
  const algo = props.spec.algorithm;
  const [locked, setLocked] = useState(false);

  const viewType: SpecViewType =
    algo.fid === -1
      ? SpecViewType.DEFAULT
      : algo.code === ""
        ? SpecViewType.GRAPH
        : SpecViewType.ALGORITHM;

  return (
    <Card>
      <CardHeader title="ECMAScript Specification"></CardHeader>
      <div className="size-full overflow-y-scroll">
        {viewType === SpecViewType.ALGORITHM ? (
          <AlgoViewer {...props} />
        ) : viewType === SpecViewType.GRAPH ? (
          <Graphviz dot={props.spec.algorithm.dot} />
        ) : (
          <p className="px-4">
            Please write JavaScript code and press the run button.
          </p>
        )}
      </div>
    </Card>
  );
}
