import JSCallStackViewer from "./JSCallStackViewer";
import SpecCallStackViewer from "./SpecCallStackViewer";

export default function CallStackViewer() {
  return <>
    <SpecCallStackViewer />
    <JSCallStackViewer />
  </>
}