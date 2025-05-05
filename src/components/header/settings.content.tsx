import { useCallback } from "react";
import { Field, Label } from "@headlessui/react";
import { Switch } from "../button/switch";
import { useAtom } from "jotai";
import { atoms } from "@/atoms";

export default function SettingsContent() {
  const [devMode, setDevMode] = useAtom(atoms.app.devModeAtom);
  const [showVisited, setShowVisited] = useAtom(atoms.app.highlightVisitedAtom);

  const toggleDevMode = useCallback(() => setDevMode(d => !d), []);
  const toggleShowVisited = useCallback(() => setShowVisited(s => !s), []);

  return (
    <div className="space-y-6">
      <article className="space-y-2">
        <Field>
          <Label className="font-500 text-xl">Developer Mode&nbsp;</Label>
          <Switch checked={devMode} onChange={toggleDevMode} />
        </Field>
        <Field>
          <Label className="font-500 text-xl">Show Visited Steps&nbsp;</Label>
          <Switch checked={showVisited} onChange={toggleShowVisited} />
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
