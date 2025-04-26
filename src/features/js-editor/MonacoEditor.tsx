import { useEffect, useRef, useCallback, useMemo } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as monaco_editor from "monaco-editor";
import { createRangeFromIndices } from "./JSEditor.util";
import { LoaderCircleIcon } from "lucide-react";
import {
  currentMode,
  usePreferredColorScheme,
} from "@/hooks/usePreferredColorScheme";

interface Props {
  code: string;
  onChange: (code: string) => void;
  start: number;
  end: number;
  readOnly?: boolean;
}

export default function MonacoEditor({
  code,
  onChange,
  start,
  end,
  readOnly,
}: Props) {
  const monacoRef = useRef<typeof monaco_editor | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorations = useRef<editor.IEditorDecorationsCollection | null>(null);

  const monacoDidMount = useCallback(
    (mountedEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      // TODO add basic definitions
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
      monaco.editor.addKeybindingRule({
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
        command: null,
        when: null,
      });
      monacoRef.current = monaco;
      editorRef.current = mountedEditor;
      decorations.current = mountedEditor.createDecorationsCollection();
    },
    [],
  );

  const options: editor.IStandaloneEditorConstructionOptions = useMemo(() => {
    return {
      scrollbar: {
        alwaysConsumeMouseWheel: false,
      },
      minimap: { enabled: false },
      wordWrap: "on",
      readOnly,
      lineNumbers: "on",
      fontSize: 14,
      tabSize: 2,
      fontFamily: '"Fira code", "Fira Mono", monospace',
      automaticLayout: true,
      lineNumbersMinChars: 4,
      glyphMargin: false,
      folding: false,
    };
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

  usePreferredColorScheme((mode: "light" | "dark") => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(mode === "dark" ? "vs-dark" : "light");
    }
  });

  return (
    <Editor
      loading={<Loading />}
      // className={showAfterMount ? "" : "invisible"}
      language="javascript"
      value={code}
      onChange={s => onChange(s || "")}
      onMount={monacoDidMount}
      theme={currentMode() === "light" ? "light" : "vs-dark"}
      options={options}
    />
  );
}

function Loading() {
  return (
    <LoaderCircleIcon className="animate-spin text-neutral-500" size={32} />
  );
}
