import Card from "@/components/layout/Card";
import { CardHeaderMultiple } from "@/components/layout/CardHeader";

import { TextIcon } from "lucide-react";
import { ContextViewer } from "./ContextViewer";
import { atom, ExtractAtomValue, useAtom, useAtomValue } from "jotai";
import { atoms } from "@/atoms";
import { SuspenseBoundary } from "@/components/primitives";
import { lazy } from "react";

const Graphviz = lazy(() => import("./Graphviz"));

function SpecViewerContent() {
  const context = useAtomValue(atoms.state.contextAtom);

  if (!context) {
    return (
      <div className="size-full flex items-center justify-center">
        <aside className="text-center py-4">Context Not Found</aside>
      </div>
    );
  }

  return <ContextViewer full context={context} />;
}

function ESMetaIRViewer() {
  const context = useAtomValue(atoms.state.contextAtom);

  if (!context) {
    return (
      <div className="size-full flex items-center justify-center">
        <aside className="text-center py-4">Context Not Found</aside>
      </div>
    );
  }

  return <Graphviz dot={context.algoDot} />;
}

const titlesDev = ["ECMAScript Specification", "ESMeta CFG"] as const;

const titlesProd = ["ECMAScript Specification"] as const;

const titlesAtom = atom(get => {
  const devMode = get(atoms.app.devModeAtom);
  return devMode ? titlesDev : titlesProd;
});

type Titles =
  | ExtractAtomValue<typeof titlesAtom>[number]
  | ExtractAtomValue<typeof titlesAtom>[number];

const __titleInternalAtom = atom<Titles | undefined>(undefined);

const titleAtom = atom(
  get => {
    return get(__titleInternalAtom) ?? get(titlesAtom)[0];
  },
  (get, set, update: Titles) => {
    set(__titleInternalAtom, update);
  },
);

export function SpecViewer() {
  const titles = useAtomValue(titlesAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const showSpec = title === titlesDev[0];

  return (
    <Card className="size-full flex flex-col transition-opacity">
      <CardHeaderMultiple
        titles={titles}
        title={title}
        onSelect={setTitle}
        icon={<TextIcon size={14} className="inline" />}
      />
      <div className={showSpec ? "overflow-scroll" : "size-full"}>
        <SuspenseBoundary fatal>
          {showSpec ? <SpecViewerContent /> : <ESMetaIRViewer />}
        </SuspenseBoundary>
      </div>
    </Card>
  );
}
