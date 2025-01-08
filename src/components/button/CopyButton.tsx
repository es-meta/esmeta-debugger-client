import { useCallback } from "react";
import { toast } from "react-toastify";

interface Props {
  className?: string;
  content?: string | undefined | null;
  children: React.ReactNode;
}

export default function CopyButton({ content, className, children }: Props) {
  const handleCopy = useCallback(() => {
    if (content !== null && content !== undefined) {
      navigator.clipboard
        .writeText(content)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(err => toast.error("Failed to copy: ", err));
    } else {
      toast.info("Nothing to copy!");
    }
  }, [content]);

  return (
    <button className={className} onClick={handleCopy}>
      {children}
    </button>
  );
}
