import { useCallback } from "react";
import "@/styles/JSEditor.css";

import { AppState } from "@/store/reducers/AppState";
import { CopyIcon } from "lucide-react";

import Code from "./Code";

import StateTransition from "@/components/custom/StateTransition";
import { connector, type JSEditorProps } from "./JSEditor.redux";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

export default connector(function JSEditor({
  appState,
  js,
  edit,
}: JSEditorProps) {
  const { code, start, end } = js;

  // size = 14;

  const onCodeChange = useCallback(
    (code: string) => {
      if (appState === AppState.JS_INPUT) edit(code);
    },
    [appState, edit],
  );

  return (
    <Card>
      <CardHeader title="JavaScript Editor">
        <div className="flex flex-row px-4 justify-between">
          <StateTransition state={true ? "astReady" : "loading"} />
          <div className="flex flex-row gap-2">
            <CopyIcon />
          </div>
        </div>
      </CardHeader>

      <div className="overflow-auto border-t rounded bg-neutral-200 size-full flex flex-col">
        <Code
          code={code}
          onChange={onCodeChange}
          start={start}
          end={end}
          readOnly={appState !== AppState.JS_INPUT}
        />
      </div>
    </Card>
  );
});
