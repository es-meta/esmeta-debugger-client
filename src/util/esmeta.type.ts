export interface Mocking {
  state: {
    heap: () => string;
    context: () => string;
    callstack: () => string;
  };

  spec: {
    func: () => string;
  };

  exec: {
    run: (code: string) => string;
    step: () => string;
    stepOver: () => string;
    stepOut: () => string;
    continue: () => string;
    esStep: () => string;
    esStepOver: () => string;
    esStepOut: () => string;
  };

  breakpoint: {
    add: (raw: string) => string;
    remove: (raw: string) => string;
    toggle: (raw: string) => string;
  };
}
