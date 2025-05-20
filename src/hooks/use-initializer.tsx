import { atoms, useSetAtom } from "@/atoms";
import { IS_DEBUG } from "@/constants";
import { AppState } from "@/types";
import { useStore } from "jotai";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function useInitializer() {
  const store = useStore();
  const setAppState = useSetAtom(atoms.app.appState);

  useEffect(() => {
    if (IS_DEBUG)
      toast.warn(
        <p>
          This app is running in development mode. Please use{" "}
          <code>npm start</code> instead.
        </p>,
      );
  }, []);

  useEffect(() => {
    Promise.all([store.get(atoms.spec.irFuncsAtom)]).then(() =>
      setAppState(AppState.JS_INPUT),
    );
  }, [setAppState]);

  return null;
}
