import { useSelector } from "react-redux";
import AlgoViewer from "./algo/AlgoViewer";
import Graphviz from "./Graphviz";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
// import { LinkIcon, LockIcon, LockOpenIcon } from "lucide-react";

// view type of spec
enum SpecViewType {
  GRAPH,
  ALGORITHM,
  DEFAULT,
}

import { selector } from "./SpecViewer.redux";
import { BookMarkedIcon } from "lucide-react";

export default function SpecViewer() {
  // TODO optimize
  const props = useSelector(selector);
  const algo = props.algo;

  const viewType: SpecViewType =
    algo.fid === -1
      ? SpecViewType.DEFAULT
      : algo.code === ""
        ? SpecViewType.GRAPH
        : SpecViewType.ALGORITHM;

  return (
    <Card>
      <CardHeader
        title="ECMAScript Specification"
        icon={<BookMarkedIcon size={14} className="inline" />}
      ></CardHeader>
      <div className="flex flex-col overflow-scroll">
        {viewType === SpecViewType.ALGORITHM ? (
          <AlgoViewer {...props} />
        ) : viewType === SpecViewType.GRAPH ? (
          <Graphviz dot={props.algo.dot} />
        ) : (
          <EmptyView />
        )}
      </div>
    </Card>
  );
}

function EmptyView() {
  return (
    <p className="text-neutral-500 p-2">
      Please write JavaScript code and press the run button.
    </p>
  );
}
