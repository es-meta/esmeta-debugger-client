import { useTransient } from "@/hooks/use-transient";
import { CopyCheckIcon, CopyIcon, CopyXIcon } from "lucide-react";
import { useCallback } from "react";
import { cn } from "@/utils";
import { ShareIconButton } from "./share-icon-button";

interface Props {
  content: string;
  className?: string;
}

export function CopyURLBox({ content, className }: Props) {
  const [copied, setCopied] = useTransient<boolean | null>(null, 1000);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(content.toString())
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, [content, setCopied]);

  return (
    <div
      className={cn(
        "flex flex-row font-pixel justify-between items-center w-full text-xl bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-hidden",
        className,
      )}
    >
      <div
        className="group/copybox  flex flex-row items-center grow gap-4"
        onClick={handleCopy}
      >
        <textarea
          readOnly
          spellCheck={false}
          rows={1}
          value={content.toString()}
          className={cn(
            "resize-none",
            "align-middle",
            "transition-colors grow pl-4 py-4",
            "w-full text-base text-center overflow-x-auto overflow-y-hidden whitespace-nowrap",
            copied === true && "text-green-300",
            copied === false && "text-red-300",
          )}
        />
        <button className="group-active/copybox:scale-[0.85] [&>svg]:size-[1em] pr-4 group-hover/copybox:opacity-75 group-hover/copybox:scale-105 transition-all">
          {copied === null ? (
            <CopyIcon />
          ) : copied ? (
            <CopyCheckIcon />
          ) : (
            <CopyXIcon />
          )}
        </button>
      </div>
      <ShareIconButton
        className="mr-4"
        content={{
          url: content.toString(),
        }}
      />
    </div>
  );
}
