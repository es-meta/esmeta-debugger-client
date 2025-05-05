import { useEffect, useId, useState } from "react";
import { graphviz, GraphvizOptions } from "d3-graphviz";
import { twJoin } from "tailwind-merge";
import { Loading } from "./Graphviz.load";
import { useAppSelector } from "@/hooks";
import { busyStateSelector } from "@/store/selectors";

interface Props {
  dot: string;
}

const defaultOptions: GraphvizOptions = {
  fit: false,
  zoom: true,
};

export default function Graphviz({ dot }: Props) {
  const [completed, setCompleted] = useState<string | null>(null);
  const id = useId();

  useEffect(() => {
    graphviz(`#${CSS.escape(id)}`, defaultOptions).renderDot(dot, () =>
      setCompleted(dot),
    );
  }, [dot]);

  const busy = useAppSelector(busyStateSelector);

  const isLoading = completed !== dot || busy;

  return (
    <div className="relative [&>&>svg]:size-full size-full">
      {isLoading ? <Loading /> : null}
      <div
        id={id}
        className={twJoin(
          "size-full overflow-hidden [&>svg]:size-full transition-opacity duration-100",
          isLoading && "opacity-90",
        )}
      />
    </div>
  );
}
