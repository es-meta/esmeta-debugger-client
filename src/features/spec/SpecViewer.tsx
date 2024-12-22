import AlgoViewer from "./algo/AlgoViewer";
import Graphviz from "./Graphviz";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

import { connector, type SpecViewerProps } from "./SpecViewer.redux";

// view type of spec
enum SpecViewType {
  GRAPH,
  ALGORITHM,
  DEFAULT,
}

export default connector(function SpecViewer(props: SpecViewerProps) {
  const algo = props.spec.algorithm;

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
          <Graphviz
            className="graphviz-container"
            dot={props.spec.algorithm.dot}
            options={{}}
          />
        ) : (
          <p className="px-4">
            Please write JavaScript code and press the run button.
          </p>
        )}
      </div>
    </Card>
  );
});
