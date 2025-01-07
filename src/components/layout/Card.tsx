import { type PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="bg-white size-full rounded-xl flex flex-col overflow-y-scroll relative">
      {children}
    </div>
  );
}
