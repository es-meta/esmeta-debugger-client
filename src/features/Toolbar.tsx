import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";

import { AppState } from "@/store/reducers/AppState";
import {
  run,
  stop,
  specStep,
  specStepOut,
  specStepOver,
  jsStep,
  jsStepOut,
  jsStepOver,
  specContinue,
} from "@/store/reducers/Debugger";
import { ArrowDownToDotIcon, ArrowUpFromDotIcon,PlayIcon, RedoDotIcon,  Square,  SquareIcon,  StepForwardIcon, XIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  disableRun: st.appState.state !== AppState.JS_INPUT,
  disableDebuggerBtn: st.appState.state !== AppState.DEBUG_READY,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  run: () => dispatch(run()),
  stop: () => dispatch(stop()),
  specStep: () => dispatch(specStep()),
  specStepOut: () => dispatch(specStepOut()),
  specStepOver: () => dispatch(specStepOver()),
  jsStep: () => dispatch(jsStep()),
  jsStepOut: () => dispatch(jsStepOut()),
  jsStepOver: () => dispatch(jsStepOver()),
  specContinue: () => dispatch(specContinue()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type ToolbarProps = ConnectedProps<typeof connector>;

function Toolbar(props: ToolbarProps) {
  const handleKeyPress  = useCallback((event : KeyboardEvent) => {
    /*
      prevent handleKeyPress called while adding breakpoints
     */
    const focusedElement = document.activeElement;
    if(focusedElement && (focusedElement.tagName==="INPUT" || focusedElement.tagName==="TEXTAREA")) {
      return;
    }

    switch (event.key) {
      case 'r':
        run()
        break
      case 'a': case 'x': case 'q': 
        stop()
        break
      case 's':
        specStep()
        break
      case 'o':
        specStepOver()
        break
      case 'u':
        specStepOut()
        break
      case 'j':
        jsStep()
        break
      case 'v':
        jsStepOver()
        break
      case 't':
        jsStepOut()
        break
      case 'c':
        specContinue()
        break
      case 'Escape':
        break
      default:
        console.log(`other: ${event.key}`)
    }
  }, [focus]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

    const {
      specContinue,
      disableRun,
      disableDebuggerBtn,
      run,
      stop,
      specStep,
      specStepOver,
      specStepOut,
      jsStep,
      jsStepOver,
      jsStepOut,
    } = props;

  const emphasize = 'text-blue-500';

  return (
      <aside className="sticky top-0 w-full
  backdrop-blur-sm
  z-50
   
  py-0 mb-4
  "//border-b border-b-neutral-300 
    >  

        <div className="bg-neutral-100 size-full flex-row bg-opacity-75 flex items-center min-h-full space-x-0 flex-wrap p-2 gap-y-2 gap-x-1 justify-start z-[1001] lg:px-24 px-4" >

        
        {/* <div className="flex flex-row flex-wrap space-x-1 min-h-full" tabIndex={0}> */}
          <Button variant='outline' size='sm' disabled={disableRun} onClick={() => run()}>
            <PlayIcon />
            <span>
              <span className={emphasize}>R</span>
              <span>un</span>
            </span>
        </Button>
        
        <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => specContinue()}>
            <StepForwardIcon />
          <span>
            <span className={emphasize}>C</span>
            ontinue</span>
        </Button>
        
            <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => stop()}>
          <SquareIcon />
              <span>
              <span className={emphasize}>Q</span>
                <span>uit</span>
              </span>
        </Button>
        
        
        <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">&nbsp;</div>
        

            <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => specStep()}>
              <ArrowDownToDotIcon />
              <span>
              <span className={emphasize}>S</span>
                <span>tep</span>
              </span>
            </Button>
            <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => specStepOver()}>
              <RedoDotIcon />
              <span>Step&nbsp;
              <span className={emphasize}>O</span>
              ver</span>
            </Button>
            <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => specStepOut()}>
              <ArrowUpFromDotIcon />
              <span>Step&nbsp;O
              <span className={emphasize}>u</span>
              t</span>
        </Button>
        
        <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">&nbsp;</div>


        
        <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => jsStep()}>
        <ArrowDownToDotIcon />
          <span>
            <span className={emphasize}>J</span>
            S Step</span>
          </Button>
        <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => jsStepOver()}>
        <RedoDotIcon size={64} />
          
            <span>JS Step O
              <span className={emphasize}>v</span>
            er</span>
        </Button>
        
          <Button variant='outline' size='sm' disabled={disableDebuggerBtn} onClick={() => jsStepOut()}>
            <ArrowUpFromDotIcon />
            <span>JS Step Ou
              <span className={emphasize}>t</span>
            </span>
          </Button>

          <div className="h-full min-w-[1px] max-w-[1px] bg-neutral-400 block">&nbsp;</div>

        <div className="flex flex-row flex-wrap text-blue-500 underline gap-2 px-1">
          <a href="#jseditor">Editor</a>
          <a href="#jseditor">Spec</a>
          <a href="#jseditor">Call Stack</a>
          <a href="#jseditor">Env.</a>
          <a href="#jseditor">Heap</a>
          <a href="#jseditor">B.P.</a>
        </div>
      </div>
      
      
      </aside>


    );
}

export default connector(Toolbar);
