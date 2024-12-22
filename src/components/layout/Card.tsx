import { type PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="bg-white size-full rounded-xl border border-neutral-300 flex flex-col overflow-hidden relative">
      {children}
      {/* <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-neutral-200"
        // onMouseDown={handleDragStart}
      /> */}
    </div>
  );
}
