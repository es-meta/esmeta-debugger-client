import { CopyURLBox } from "./copy-url-box";
import { QUERY_ITER } from "@/atoms/defs/config";
import { SEARCHPARAM_NAME_PROG } from "@/constants";
import { useAppSelector } from "@/hooks";

export default function ShareButtonContent() {
  const code = useAppSelector(st => st.js.code);

  const href = new URL(window.location.href);
  href.search = "";

  const withCode = new URL(window.location.href);
  withCode.search = "";
  withCode.searchParams.set(SEARCHPARAM_NAME_PROG, code);

  const withMoment = new URL(window.location.href);
  withMoment.search = "";
  withMoment.searchParams.set(SEARCHPARAM_NAME_PROG, code);
  withMoment.searchParams.set(QUERY_ITER, (0).toString());

  return (
    <div className="space-y-6">
      <article className="space-y-2 mt-6">
        <h3 className="font-500 text-xl">Share this website:</h3>

        <div className="flex flex-row">
          <CopyURLBox content={href} />
        </div>
      </article>

      <article className="space-y-2">
        <h3 className="font-500 text-xl">Share with code:</h3>
        <CopyURLBox content={withCode} />
      </article>

      <article className="space-y-2">
        <h3 className="font-500 text-xl">Share code and current state:</h3>
        <CopyURLBox content={withMoment} />

        <aside>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This link enables `resume` button, which will start the program from
            the current state.
          </p>
        </aside>
      </article>
    </div>
  );
}
