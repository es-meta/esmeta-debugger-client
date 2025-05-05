import { useCallback } from "react";
import { Field, Label } from "@headlessui/react";
import { Switch } from "../button/switch";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleDevMode } from "@/store/reducers/app-state";

export default function SettingsContent() {
  const dispatch = useAppDispatch();
  const devMode = useAppSelector(state => state.appState.devMode);

  const toggle = useCallback(() => dispatch(toggleDevMode()), [dispatch]);

  return (
    <div className="space-y-6">
      <article className="space-y-2">
        <Field>
          <Label className="font-500 text-xl">Internal Mode&nbsp;</Label>
          <Switch checked={devMode} onChange={toggle} />
        </Field>

        <aside>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This mode enables some internal features, such as{" "}
            <code>Iter +</code> and <code>Iter -</code>.
          </p>
        </aside>
      </article>
    </div>
  );
}
