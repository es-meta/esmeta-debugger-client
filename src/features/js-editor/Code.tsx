import { useEffect, useRef, useCallback, useMemo } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as monaco_editor from "monaco-editor";
import { createRangeFromIndices } from "./JSEditor.util";
import { LoaderIcon } from "lucide-react";

interface Props {
  code: string;
  onChange: (code: string) => void;
  start: number;
  end: number;
  readOnly?: boolean;
}

function Loading() {
  return <LoaderIcon className="animate-spin text-blue-500" size={32} />;
}

export default function Code({ code, onChange, start, end, readOnly }: Props) {
  const monacoRef = useRef<typeof monaco_editor | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorations = useRef<editor.IEditorDecorationsCollection | null>(null);

  const monacoDidMount = useCallback(
    (mountedEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      // var coreDefsName = 'lib.es5.d.ts';

      // // Import the text of your chosen def file.  This will depend on your bundler.
      // var coreDefs = ('./' + coreDefsName);

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        noLib: true,
        allowNonTsExtensions: true,
      });
      monaco.languages.typescript.javascriptDefaults.setExtraLibs([
        {
          content: "declare function print(value: any): void;",
        },
      ]);

      monacoRef.current = monaco;
      editorRef.current = mountedEditor;
      decorations.current = mountedEditor.createDecorationsCollection();
      console.info("decorations is " + decorations.current);
    },
    [],
  );

  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly });
  }, [readOnly]);

  useEffect(() => {
    if (!monacoRef.current || !decorations.current || !editorRef.current) {
      console.info("no monaco or decorations");
      return;
    }

    if (start === -1 || end === -1) {
      decorations.current?.clear();
      return;
    } else {
      const range = createRangeFromIndices(code, start, end);

      decorations.current?.set([
        {
          range: new monacoRef.current.Range(
            range.startLineNumber,
            range.startColumn,
            range.endLineNumber,
            range.endColumn,
          ),
          options: {
            inlineClassName: "my-highlight",
          },
        },
      ]);
    }
  }, [code, start, end]);

  return (
    <Editor
      className="bg-neutral-100"
      loading={<Loading />}
      language="javascript"
      value={code}
      onChange={s => onChange(s || "")}
      onMount={monacoDidMount}
      options={options}
    />
  );
}

const options: editor.IStandaloneEditorConstructionOptions = {
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
  minimap: { enabled: false },
  wordWrap: "on",
  readOnly: false,
  lineNumbers: "on",
  fontSize: 14,
  tabSize: 2,
  fontFamily: '"Fira code", "Fira Mono", monospace',
  theme: "vs",
  automaticLayout: true,
};
