import { SortableElement } from "react-sortable-hoc";
import { useRecoilState } from "recoil";
import { windowFamily } from "../../store/windows";
import SelectionWindow from "../../views/dashboard/main/windows/SelectionWindow";

const WindowWrapper = ({ windowId, index }) => {
  const [window, setWindow] = useRecoilState(windowFamily(windowId));

  if(window.collapse) return null

  // to display each window of the Draggable Windows
  const SortableItem = SortableElement(({ value: windowId }) => (
    <SelectionWindow windowId={windowId} />
  ));

  return <SortableItem index={index} value={windowId} />;
};

export default WindowWrapper;