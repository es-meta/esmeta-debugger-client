import { useCallback, lazy, useEffect, useState } from "react";
import "@/styles/JSEditor.css";
import { Loading } from "./monaco/monaco.load";
import { AppState } from "@/types";
import Card from "@/components/layout/Card";
import { CardHeaderMultiple } from "@/components/layout/CardHeader";
import { CodeIcon } from "lucide-react";
import { atoms, useAtomValue } from "@/atoms";
import { atom, useAtom } from "jotai";
import { SuspenseBoundary } from "@/components/primitives";

const MonacoEditor = lazy(() => import("./monaco"));
const AstView = lazy(() => import("./ast"));

const isJsReadOnly = atom(get => {
  const appState = get(atoms.app.appState);
  return !(appState === AppState.INIT || appState === AppState.JS_INPUT);
});

function JSEditorContent() {
  const [code, forceEdit] = useAtom(atoms.app.jsCodeAtom);
  const readOnly = useAtomValue(isJsReadOnly);
  const reprint = useAtomValue(atoms.state.reprintAtom);
  const contextIdx = useAtomValue(atoms.state.contextIdxAtom);
  const callstack = useAtomValue(atoms.state.callstackAtom);

  const context = callstack?.[contextIdx];
  const [start, end] = context?.jsRange ?? [-1, -1];

  useEffect(() => {
    if (reprint) {
      forceEdit(reprint);
    }
  }, [reprint, forceEdit]);

  const handleCodeChange = useCallback(
    (code: string) => {
      if (!readOnly) {
        forceEdit(code);
      }
    },
    [readOnly, forceEdit],
  );

  return (
    <MonacoEditor
      code={code}
      onChange={handleCodeChange}
      start={start}
      end={end}
      readOnly={readOnly}
    />
  );
}

const titles = ["JavaScript Editor", "AST Viewer"] as const;

export function JSCodeEditor() {
  const [show, setShow] = useState<(typeof titles)[number]>(titles[0]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeaderMultiple
        title={show}
        titles={titles}
        icon={<CodeIcon size={14} className="inline" />}
        onSelect={setShow}
      />
      <div className="overflow-hidden size-full flex flex-col">
        <SuspenseBoundary
          fatal
          loading={
            <div className="flex items-center justify-center size-full">
              <Loading />
            </div>
          }
        >
          {show === "JavaScript Editor" ? <JSEditorContent /> : <AstView />}
        </SuspenseBoundary>
      </div>
    </Card>
  );
}
