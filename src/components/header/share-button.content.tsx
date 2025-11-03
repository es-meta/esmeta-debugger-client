import { CopyURLBox } from "./copy-url-box";
import { SEARCHPARAM_NAME_ITER, SEARCHPARAM_NAME_PROG } from "@/constants";
import { atoms, useAtomValue } from "@/atoms";

export default function ShareButtonContent() {
  const config = useAtomValue(atoms.config.givenConfigAtom);
  const api = config.api;
  const code = useAtomValue(atoms.app.jsCodeAtom);
  // TODO use better count in spec
  const stepCnt = useAtomValue(atoms.state.stepCntAtom);

  const href = new URL(window.location.href);
  href.search = "";

  const basic = href.toString();

  href.searchParams.set(SEARCHPARAM_NAME_PROG, code);

  const withCode = href.toString();

  if (stepCnt !== null)
    href.searchParams.set(SEARCHPARAM_NAME_ITER, String(stepCnt));

  const withMoment = stepCnt === null ? null : href.toString();

  return (
    <div className="space-y-6">
      <article className="space-y-2 mt-6">
        <h3 className="font-500">Share this website:</h3>

        <div className="flex flex-row">
          <CopyURLBox content={basic} />
        </div>
        <LengthWarning length={basic.length} />
      </article>

      <article className="space-y-2">
        <h3 className="font-500">Share with code:</h3>
        <CopyURLBox content={withCode} />
        <LengthWarning length={withCode.length} />
      </article>

      <article className="space-y-2">
        <h3 className="font-500">Share code and current state:</h3>
        <aside>
          This link enables `resume` button, which will start the program from
          the current state.{" "}
          <span className="text-red-500 dark:text-red-400">
            Please note that this link might break after ECMA-262 or ESMeta
            updates.
          </span>
        </aside>
        {withMoment !== null ? (
          <CopyURLBox content={withMoment} />
        ) : (
          <aside className="text-es-500 dark:text-es-400">
            Something went wrong, this link is not available for now. You might
            need to start debugging to get this link.
          </aside>
        )}
        <LengthWarning length={withMoment?.length ?? 0} />
      </article>
    </div>
  );
}

function LengthWarning({ length }: { length: number }) {
  const URL_TOO_LONG_THRESHOLD = 2000;

  if (length > URL_TOO_LONG_THRESHOLD) {
    return (
      <aside className="text-es-500 dark:text-es-400">
        Note: The URL is extremely long, some platforms may have issues handling
        it.
      </aside>
    );
  }
  return null;
}
