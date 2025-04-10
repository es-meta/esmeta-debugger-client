import { useCallback, useEffect, useRef, useState } from "react";
import { type Graphviz, graphviz, GraphvizOptions } from "d3-graphviz";
import { twJoin } from "tailwind-merge";
import { Loader2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import { ReduxState } from "@/store";

interface Props {
  dot: string;
}

const defaultOptions: GraphvizOptions = {
  fit: false,
  zoom: true,
};

export default function Graphviz({ dot }: Props) {
  const [completed, setCompleted] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const notify = useCallback(() => {
    setCompleted(dot);
  }, [dot]);

  useEffect(() => {
    graphviz(ref.current, defaultOptions).renderDot(dot, notify);
  }, [dot]);

  const busy = useSelector((st: ReduxState) => st.appState.busy);

  const isLoading = completed !== dot || busy;

  return (
    <div className="relative [&>&>svg]:size-full size-full">
      {isLoading ? (
        <div
          className={twJoin(
            "absolute",
            "top-1/2 left-1/2",
            "-translate-x-1/2",
            "-translate-y-1/2",
          )}
        >
          <Loader2Icon className="animate-spin text-black z-50" />
        </div>
      ) : null}
      <div
        ref={ref}
        className={twJoin(
          "size-full overflow-hidden [&>svg]:size-full transition-opacity duration-100",
          isLoading && "opacity-90",
        )}
      />
    </div>
  );
}
