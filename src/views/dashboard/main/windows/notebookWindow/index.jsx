import { Window } from "../window";
import JupyterViewer from "react-jupyter-notebook";
export const NotebookWindow = ({
  window,
  onClose,
  onCollapse,
  onResotre,
  collapseState,
  onTypeChange,
}) => {
  return (
    <Window
      window={window}
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onResotre}
      onTypeChange={onTypeChange}
      title="Notebook"
      collapseState={collapseState}
      icon="th"
    >
      <JupyterViewer rawIpynb={window.data}/>
    </Window>
  );
};
