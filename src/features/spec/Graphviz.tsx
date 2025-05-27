import { useEffect, useRef, useState } from "react";
import { graphviz, GraphvizOptions } from "d3-graphviz";
import { twJoin } from "tailwind-merge";
import { Loading } from "./Graphviz.load";
import { useAtomValue } from "jotai";
import { atoms } from "@/atoms";
import { usePreferredColorScheme } from "@/hooks/use-preferred-color-scheme";
import AwesomeDebouncePromise from 'awesome-debounce-promise';

interface Props {
  dot: string;
}

const defaultOptions: GraphvizOptions = {
  fit: false,
  zoom: true,
};

async function getNewDiv(dot: string): Promise<HTMLDivElement> {
  return new Promise<HTMLDivElement>((resolve) => {
    const div = document.createElement("div");

    graphviz(div, defaultOptions).renderDot(dot, () => {
      resolve(div);
    });
  });
}

const getNewDivDebounced = AwesomeDebouncePromise(getNewDiv, 100, { onlyResolvesLast : true });

function GraphvizContent({ dot }: Props) {
  const theme = usePreferredColorScheme();
  const ref = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState<string | null>(null);

  useEffect(() => {
      (getNewDivDebounced(dot)).then(div => {
        if (div && ref.current) {
          ref.current.innerHTML = ""; // Clear previous content
          ref.current.append(...div.childNodes);
        }
      }).then(() => {
        setCompleted(dot);
      }).finally(() => {
        
      });
  }, [dot]);

  const busy = useAtomValue(atoms.app.busyStateGetter);
  const isLoading = completed !== dot || busy === "busy";

  return (
    <div className="relative [&>&>svg]:size-full size-full">
      {isLoading ? <Loading /> : null}
      <div
        ref={ref}
        className={twJoin(
          "size-full overflow-hidden [&>svg]:size-full transition-opacity duration-100",
          isLoading ? "opacity-90" : "",
          theme === "dark" && "invert",
        )}
      />
    </div>
  );
}

export default function Graphviz({ dot }: Props) {
  return <GraphvizContent dot={dot} />;
}
