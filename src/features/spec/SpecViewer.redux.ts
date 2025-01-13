import { ReduxState } from "@/store";

// connect redux store
export const selector = (st: ReduxState) => ({
  irToSpecMapping: st.spec.irToSpecMapping,
  algo: st.spec.algorithm,
  irState: st.irState,
  breakpoints: st.breakpoint.items,
});

export type SpecViewerProps = ReturnType<typeof selector>;
