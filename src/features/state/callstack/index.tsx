import JSCallStackViewer from "./JSCallStackViewer";
import SpecCallStackViewer from "./SpecCallStackViewer";

export default function CallStackView() {
  return (
    <>
      <SpecCallStackViewer />
      <JSCallStackViewer />
    </>
  );
}
