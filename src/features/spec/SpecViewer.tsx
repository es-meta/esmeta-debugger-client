import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";

import { TextIcon } from "lucide-react";
import { shallowEqual, useAppSelector } from "@/hooks";
import { ContextViewer } from "./ContextViewer";

export default function SpecViewer() {
  const { contextIdx, callStack } = useAppSelector(
    st => ({ contextIdx: st.ir.contextIdx, callStack: st.ir.callStack }),
    shallowEqual,
  );

  return (
    <Card className="size-full flex flex-col">
      <CardHeader
        title="ECMAScript Specification"
        icon={<TextIcon size={14} className="inline" />}
      />
      <ContextViewer full context={callStack[contextIdx]} />
    </Card>
  );
}
