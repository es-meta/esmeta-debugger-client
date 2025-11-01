import { useCallback } from "react";
import { Field, Label } from "@headlessui/react";
import { Switch } from "../button/switch";
import { atoms, useAtom } from "@/atoms";

export default function SettingsContent() {
  const [devMode, setDevMode] = useAtom(atoms.app.devModeAtom);
  const [showVisited, setShowVisited] = useAtom(atoms.app.highlightVisitedAtom);

  const toggleDevMode = useCallback(() => setDevMode(d => !d), []);
  const toggleShowVisited = useCallback(() => setShowVisited(s => !s), []);

  return (
    <div className="space-y-6">
      <article className="space-y-2">
        <Field className="flex flex-row items-center justify-between">
          <Label className="font-500 text-lg">
            Developer Mode
            <aside>
              This mode enables some internal features, to debug the debugger
              application itself.
            </aside>
          </Label>
          <Switch checked={devMode} onChange={toggleDevMode} />
        </Field>

        <Field className="flex flex-row items-center justify-between">
          <Label className="font-500 text-lg">Show Visited Steps&nbsp;</Label>
          <Switch checked={showVisited} onChange={toggleShowVisited} />
        </Field>
      </article>
    </div>
  );
}
