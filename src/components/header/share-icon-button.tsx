import { useTransient } from "@/hooks/use-transient";
import { cn } from "@/utils";
import { ShareIcon } from "lucide-react";
import { useCallback } from "react";

type Props = (
  | {
      content: ShareData;
      getContent?: undefined;
    }
  | {
      content?: undefined;
      getContent: () => ShareData;
    }
) & {
  className?: string;
};

enum ShareState {
  IDLE,
  COPYING,
  COPIED,
  FAILED,
}

export function ShareIconButton({ content, getContent, className }: Props) {
  const [copied, setCopied] = useTransient<ShareState>(ShareState.IDLE, 1000);

  const handleCopy = useCallback(() => {
    const shareData = content !== undefined ? content : getContent();
    navigator
      .share(shareData)
      .then(() => {
        setCopied(ShareState.COPIED);
      })
      .catch(() => {
        setCopied(ShareState.FAILED);
      });
  }, [content, setCopied, getContent]);

  return (
    <button
      className={cn(
        "inline-flex justify-center items-end h-[1em] [&>svg]:size-[1em] motion-safe:active:scale-75 motion-safe:transition-all",
        "print:hidden",
        className,
      )}
      onClick={handleCopy}
    >
      <InternalIcon state={copied} />
    </button>
  );
}

/* auxiliaries */

interface InternalIconProps {
  state: ShareState;
}

function InternalIcon({ state }: InternalIconProps) {
  switch (state) {
    default:
      return <ShareIcon className="inline" />;
  }
}
