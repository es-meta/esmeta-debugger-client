import { CopyURLBox } from "./copy-url-box";
import {
  SEARCHPARAM_NAME_API,
  SEARCHPARAM_NAME_ITER,
  SEARCHPARAM_NAME_PROG,
} from "@/constants";
import { useState } from "react";
import { Switch } from "../button/switch";
import { Field, Label } from "@headlessui/react";
import { atoms, useAtomValue } from "@/atoms";

export default function ShareButtonContent() {
  const [include, setInclude] = useState(false);
  const config = useAtomValue(atoms.config.givenConfigAtom);
  const api = config.api;
  const code = useAtomValue(atoms.app.jsCodeAtom);
  const iter = useAtomValue(atoms.state.instCntAtom);

  const href = new URL(window.location.href);
  href.search = "";
  if (include) {
    // TODO import from constants or something
    href.searchParams.set(
      SEARCHPARAM_NAME_API,
      api.type === "browser" ? "browser" : api.url,
    );
  }

  const basic = href.toString();

  href.searchParams.set(SEARCHPARAM_NAME_PROG, code);

  const withCode = href.toString();

  if (iter !== null) href.searchParams.set(SEARCHPARAM_NAME_ITER, String(iter));

  const withMoment = iter === null ? null : href.toString();

  return (
    <div className="space-y-6">
      <article className="space-y-2 mt-6">
        <Field>
          <Label className="font-500 text-xl">
            Encode current API setting:&nbsp;
          </Label>
          <Switch
            checked={include}
            onChange={() => setInclude(prev => !prev)}
          />
        </Field>
      </article>
      <article className="space-y-2 mt-6">
        <h3 className="font-500 text-xl">Share this website:</h3>

        <div className="flex flex-row">
          <CopyURLBox content={basic} />
        </div>
      </article>

      <article className="space-y-2">
        <h3 className="font-500 text-xl">Share with code:</h3>
        <CopyURLBox content={withCode} />
      </article>

      <article className="space-y-2">
        <h3 className="font-500 text-xl">Share code and current state:</h3>
        <aside>
          <p>
            This link enables `resume` button, which will start the program from
            the current state.
          </p>
        </aside>
        {withMoment !== null ? (
          <CopyURLBox content={withMoment} />
        ) : (
          <aside className="text-es-500 dark:text-es-400">
            <p>
              Something went wrong, this link is not available for now. You
              might need to start debugging to get this link.
            </p>
          </aside>
        )}
      </article>
    </div>
  );
}
