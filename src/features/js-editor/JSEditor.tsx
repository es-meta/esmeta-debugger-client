import { useCallback, lazy } from "react";
import "@/styles/JSEditor.css";
import { Loading } from "./MonacoEditor.load";
import { DeferUntilIdle } from "@/components/defer-until-idle";
import { useAppSelector } from "@/hooks";
import { AppState } from "@/types";
import { shallowEqual, useDispatch } from "react-redux";
import { forceEdit } from "@/store/reducers/js";
import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { CodeIcon } from "lucide-react";

const MonacoEditor = lazy(() => import("./MonacoEditor"));

export default function JSCodeEditor() {
  const dispatch = useDispatch();
  const { code, contextIdx, callStack, readOnly } = useAppSelector(
    st => ({
      code: st.js.code,
      contextIdx: st.ir.contextIdx,
      callStack: st.ir.callStack,
      readOnly: !(
        st.appState.state === AppState.INIT ||
        st.appState.state === AppState.JS_INPUT
      ),
    }),
    shallowEqual,
  );

  const context = callStack[contextIdx];
  const [start, end] = context?.jsRange ?? [-1, -1];

  const handleCodeChange = useCallback(
    (code: string) => {
      if (!readOnly) {
        dispatch(forceEdit(code));
      }
    },
    [dispatch, readOnly, forceEdit],
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="JavaScript&nbsp;Editor"
        icon={<CodeIcon size={14} className="inline" />}
      ></CardHeader>
      <div className="overflow-hidden size-full flex flex-col">
        <DeferUntilIdle
          loading={
            <div className="flex items-center justify-center size-full">
              <Loading />
            </div>
          }
        >
          <MonacoEditor
            code={code}
            onChange={handleCodeChange}
            start={start}
            end={end}
            readOnly={readOnly}
          />
        </DeferUntilIdle>
      </div>
    </Card>
  );
}
