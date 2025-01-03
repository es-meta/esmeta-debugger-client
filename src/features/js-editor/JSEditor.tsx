import { useCallback, useEffect, useState } from "react";
import "@/styles/JSEditor.css";
import MonacoEditor from "./MonacoEditor";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { edit } from "@/store/reducers/JS";
import { AppState } from "@/store/reducers/AppState";

export default function JSEditor() {
  // size = 14;
  const dispatch = useDispatch();
  const editDispatch = useCallback(
    (code: string) => dispatch(edit(code)),
    [dispatch],
  );

  const {
    appState,
    js: { code, start, end },
  } = useSelector((state: ReduxState) => ({
    js: state.js,
    appState: state.appState.state,
  }));

  const handleCodeChange = useCallback(
    (code: string) => {
      if (appState === AppState.JS_INPUT) editDispatch(code);
    },
    [appState, edit],
  );

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(t => !t);
  }, [code]);

  return (
    <Card>
      <CardHeader title="JavaScript&nbsp;Editor">
        {/* <div className="flex flex-row px-4 justify-between">
          <StateTransition state={toggle ? "astReady" : "loading"} />
          <div className="flex flex-row gap-2">
            <CopyIcon />
          </div>
        </div> */}
      </CardHeader>

      <div className="overflow-hidden size-full border-t rounded flex flex-col">
        <MonacoEditor
          code={code}
          onChange={handleCodeChange}
          start={start}
          end={end}
          readOnly={appState !== AppState.JS_INPUT}
        />
      </div>
    </Card>
  );
}
