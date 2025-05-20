import { SuspenseBoundary } from "@/components/primitives/suspense-boundary";
import ESEnvViewer from "./es";
import SpecEnvViewer from "./spec";

export default function EnvViewer() {
  return (
    <>
      <SuspenseBoundary fatal>
        <SpecEnvViewer />
      </SuspenseBoundary>
      <SuspenseBoundary fatal>
        <ESEnvViewer />
      </SuspenseBoundary>
    </>
  );
}
