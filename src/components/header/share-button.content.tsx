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
  // TODO use better count in spec
  const stepCnt = useAtomValue(atoms.state.stepCntAtom);

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

  if (stepCnt !== null)
    href.searchParams.set(SEARCHPARAM_NAME_ITER, String(stepCnt));

  const withMoment = stepCnt === null ? null : href.toString();

  return (
    <div className="space-y-6">
      <article className="space-y-2 mt-6">
        <Field className="flex flex-row items-center justify-between">
          <Label className="font-500 text-lg">
            Encode current API setting
            <aside>
              This will include the current API setting in the shared link.
            </aside>
          </Label>
          <Switch
            checked={include}
            onChange={() => setInclude(prev => !prev)}
          />
        </Field>
      </article>
      <article className="space-y-2 mt-6">
        <h3 className="font-500 text-lg">Share this website:</h3>

        <div className="flex flex-row">
          <CopyURLBox content={basic} />
        </div>
        {basic.length > URL_TOO_LONG_THRESHOLD && (
          <aside className="text-es-500 dark:text-es-400">
            <p>
              Note: The URL is quite long, some platforms may have issues
              handling it.
            </p>
          </aside>
        )}
      </article>

      <article className="space-y-2">
        <h3 className="font-500 text-lg">Share with code:</h3>
        <CopyURLBox content={withCode} />
        {withCode.length > URL_TOO_LONG_THRESHOLD && (
          <aside className="text-es-500 dark:text-es-400">
            <p>
              Note: The URL is quite long, some platforms may have issues
              handling it.
            </p>
          </aside>
        )}
      </article>

      <article className="space-y-2">
        <h3 className="font-500 text-lg">Share code and current state:</h3>
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
        {(withMoment?.length ?? 0) > URL_TOO_LONG_THRESHOLD && (
          <aside className="text-es-500 dark:text-es-400">
            <p>
              Note: The URL is quite long, some platforms may have issues
              handling it.
            </p>
          </aside>
        )}
      </article>
    </div>
  );
}

const URL_TOO_LONG_THRESHOLD = 2000;
