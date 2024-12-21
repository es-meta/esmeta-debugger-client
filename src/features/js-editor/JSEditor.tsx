import React, {  useCallback, useRef, useEffect } from "react";
import "@/styles/JSEditor.css";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { edit } from "@/store/reducers/JS";
import { AppState } from "@/store/reducers/AppState";
import { CopyIcon } from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { toast } from "react-toastify";

import StateTransition from "@/components/custom/StateTransition";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  js: st.js,
  appState: st.appState.state,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  edit: (code: string) => dispatch(edit(code)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type JSEditorProps = ConnectedProps<typeof connector>;

class JSEditor extends React.Component<JSEditorProps>{

  size =14;

  onCodeChange(code: string) {
    if (this.props.appState === AppState.JS_INPUT) this.props.edit(code);
  }

  render() {
    const { code, start, end } = this.props.js;

  return (
    <div
      id="jseditor"
      className=" bg-white rounded-xl border border-neutral-300 size-full flex flex-col"
    >

      <header>
        <div className="flex flex-row px-4">
          <h3>
            JavaScript
          </h3>
        </div>
      
        <div className="flex flex-row px-4 justify-between">
          <StateTransition state={true ? "astReady" : "loading"} />
          <div className="flex flex-row gap-2">
            <CopyIcon />
          </div>
        </div>
      </header>

      <div className="overflow-auto border-t rounded bg-neutral-200 size-full flex flex-col">
        <Code code={code} onChange={this.onCodeChange} start={start} end={end} readOnly={this.props.appState !== AppState.JS_INPUT} />
      </div>
    </div>
  );
}
}

export default connector(JSEditor);


interface Props {
  code: string;
  onChange: (code: string) => void;
  start: number
  end: number
  readOnly?: boolean;
}

function Code({ code, onChange, start, end, readOnly }: Props) {
  
  const monaco = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorations = useRef<editor.IEditorDecorationsCollection | null>(null);

  const ref = useCallback((mountedEditor: editor.IStandaloneCodeEditor) => {
    toast.info('editor mounted');


    // editor.defineTheme('myTheme', {
    //   base: 'vs',
    //   inherit: true,
    //   rules: [],
    //   colors: {
    //       'editor.background': '#efefef',
    //   },
    // });
    
    mountedEditor.updateOptions({
      minimap: { enabled: false },
      wordWrap: 'on',
      readOnly: false,
      lineNumbers: 'on',
      fontSize: 14,
      fontFamily: '"Fira code", "Fira Mono", monospace',
      theme: 'vs',
    })


    editorRef.current = mountedEditor;
    decorations.current = mountedEditor.createDecorationsCollection();
    toast.info('decorations is ' + decorations.current)
  }, [])

  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly })
   }, [readOnly]);

  useEffect(() => {
    if (!monaco || !decorations.current || !editorRef.current) {
      toast.info('no monaco or decorations');
      return;
    };

    toast.info('setting decorations');

    const range = createRangeFromIndices(code, start, end);

    const res = decorations.current?.set([
      {
        range: new monaco.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn),
        options: {
          inlineClassName: "my-highlight",
        },
      }
    ]);

    toast.info('set decorations: ' + JSON.stringify(res));

  }, [code, start, end]);


  return <Editor
    className="size-full bg-neutral-100"
    height="90vh"
      // loading={<div>로딩...</div>}
    language="javascript"
    value={code}
    onChange={s => onChange(s || '')}
    onMount={ref}
  />;
}


function createRangeFromIndices(text : string, from: number, to: number) {
  const lines = text.split("\n"); // Split the text into lines

  let currentPos = 0;
  let startLineNumber = 0, startColumn = 0;
  let endLineNumber = 0, endColumn = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLength = line.length + 1; // +1 for the newline character

    if (from >= currentPos && from < currentPos + lineLength) {
      startLineNumber = i + 1; // Line numbers are 1-based
      startColumn = from - currentPos + 1; // Columns are 1-based
    }

    if (to >= currentPos && to < currentPos + lineLength) {
      endLineNumber = i + 1;
      endColumn = to - currentPos + 1;
      break; // Stop when we find the end position
    }

    currentPos += lineLength;
  }

  return {
    startLineNumber,
    startColumn,
    endLineNumber,
    endColumn
  };
}
