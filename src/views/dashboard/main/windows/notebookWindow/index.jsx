import { Window } from "../window";
import "./styles.module.css";
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
      title={window.data.name}
      collapseState={collapseState}
      icon="th"
    >
      <div style={{overflowY:"auto",height:"100%"}}>
      <JupyterViewer rawIpynb={window.data.fileParsedJson}/>
      </div>
      
      
    </Window>
  );
};
