import { useEffect, useRef, useCallback, useMemo } from "react";
import Editor, {
  type BeforeMount,
  type OnMount,
  type Monaco,
} from "@monaco-editor/react";
import { logger } from "@/utils";
import { createRangeFromIndices } from "./utils";
import { usePreferredColorScheme } from "@/hooks/use-preferred-color-scheme";
import { Loading } from "./monaco.load";

type IStandaloneCodeEditor = Parameters<OnMount>[0];
type IStandaloneEditorConstructionOptions = NonNullable<
  Parameters<typeof Editor>[0]["options"]
>;
type IEditorDecorationsCollection = ReturnType<
  IStandaloneCodeEditor["createDecorationsCollection"]
>;

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
  const prefers = usePreferredColorScheme();
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const decorations = useRef<IEditorDecorationsCollection | null>(null);

  const setDecorations = useCallback((start: number, end: number) => {
    if (start === -1 || end === -1) {
      decorations.current?.clear();
      return;
    } else if (monacoRef.current && decorations.current) {
      const range = createRangeFromIndices(code, start, end);

      decorations.current.set([
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
  }, []);

  const monacoBeforeMount: BeforeMount = useCallback(monaco => {
    monaco.editor.defineTheme("my-vs-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        // transparent background
        "editor.background": "#00000000",
      },
    });
  }, []);

  const monacoDidMount: OnMount = useCallback((mountedEditor, monaco) => {
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
    setDecorations(start, end);
  }, []);

  const options: IStandaloneEditorConstructionOptions = useMemo(() => {
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
      lineNumbersMinChars: 3,
      glyphMargin: false,
      folding: false,
    };
  }, [readOnly]);

  useEffect(() => {
    if (!monacoRef.current || !decorations.current || !editorRef.current) {
      logger.info?.("no monaco or decorations");
      return;
    }
    setDecorations(start, end);
  }, [code, start, end]);

  return (
    <Editor
      loading={<Loading />}
      language="javascript"
      value={code}
      onChange={s => onChange(s || "")}
      beforeMount={monacoBeforeMount}
      onMount={monacoDidMount}
      theme={prefers === "light" ? "light" : "my-vs-dark"}
      options={options}
    />
  );
}
