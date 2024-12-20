import React, { ForwardedRef, forwardRef, RefObject, useCallback, useRef } from "react";
import Editor from "react-simple-code-editor";
import { v4 as uuid } from "uuid";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "@/styles/JSEditor.css";

import {Button, OverlayArrow, Tooltip, TooltipTrigger} from "react-aria-components";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "../store";
import { edit } from "../store/reducers/JS";
import { AppState } from "../store/reducers/AppState";
import {
  CircleIcon,
  CopyIcon,
  FileIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
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

import { useState, useEffect } from "react";
import ToolButtonGroup from "./toolbar/ButtonGroup";
import ToolButton from "./toolbar/ToolButton";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    }; //value 변경 시점에 clearTimeout을 해줘야함.
  }, [value]);

  return debouncedValue;
};


function CopyButton({ target } : { target : RefObject<HTMLInputElement> }, ) {
  let [isOpen, setOpen] = React.useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(target.current?.value || "").then(() => {
      setOpen(true);
      setTimeout(() => setOpen(false), 1000);
    });
  }, []);

  return (
    <button onClick={copyToClipboard}>
    <TooltipTrigger isOpen={isOpen} onOpenChange={() => null}>
      <Button><CopyIcon /></Button>
      <Tooltip>
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        Copied!
      </Tooltip>
    </TooltipTrigger>
    </button>
  );
};

function JSEditor(props: JSEditorProps) {

  const ref = useRef<HTMLDivElement>(null);

  const [parsing, setParsing] = React.useState(false);

  const [value, setValue] = useState<string>(AppState.JS_INPUT);
  const [size, setSize] = useState<number>(14);
  const debouncedValue = useDebounce(value, 500); // 500ms debounce delay

  const parseApiCall = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    console.log("Parsing:");

    if (parseApiCall.current !== null) {
      clearTimeout(parseApiCall.current);
      parseApiCall.current = null;
    }

    setParsing(false);

    parseApiCall.current = setTimeout(() => {
      console.log("Parsing: 1");
      setParsing(true);
      parseApiCall.current = null;
    }, 500);

    // console.log('Debounced Value:', value);
  }, [value]);

  const onCodeChange = (code: string) => {
    setValue(code);
    if (props.appState === AppState.JS_INPUT) props.edit(code);
  };

  const { code, start, end } = props.js;
  return (
    <div
      id="jseditor"
      className=" bg-white rounded-xl border border-neutral-300"
    >
      <div className="flex flex-row px-4">
        {/* <Paper className="editor-container" variant="outlined"> */}
        <h3>
        JavaScript
        </h3>
        </div>
      
      <div className="flex flex-row px-4 justify-between">

        <StateTransition state={parsing ? "astReady" : "loading"} />

        
        <div className="flex flex-row gap-2">
          <CopyButton />
        </div>

      </div>

      <div className="editor-wrapper">
        <Editor
          ref={ref}
          value={code}
          onValueChange={code => onCodeChange(code)}
          highlight={code => highlightWithLine(code, start, end)}
          // padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: size,
          }}
          textareaId="editor-textarea"
          className="editor"
        />
      </div>
      {/* </Paper> */}
    </div>
  );
}

export default connector(JSEditor);

function genMarker(): [string, string] {
  const genUid = () => `"${uuid()}"`;

  return [genUid(), genUid()];
}

function highlightWithLine(code: string, start = -1, end = -1): string {
  let highlighted: string;
  // use highlighting when start, end index is given
  if (start >= 0 && end >= 0 && start != end) {
    const [startMarker, endMarker] = genMarker();
    const marked =
      code.slice(0, start) +
      startMarker +
      code.slice(start, end) +
      endMarker +
      code.slice(end, code.length);
    highlighted = highlight(marked, languages.js, "js")
      .replace(`<span class="token string">${startMarker}</span>`, "<mark>")
      .replace(`<span class="token string">${endMarker}</span>`, "</mark>");
  } else highlighted = highlight(code, languages.js, "js");
  // decorate with line info
  return highlighted
    .split("\n")
    .map((l, idx) => {
      const codeStr = `${l}`;
      return (
        `<span class="editor-line" onclick="console.log('test')">${
          idx + 1
        } |</span>` + codeStr
      );
    })
    .join("\n");
}
