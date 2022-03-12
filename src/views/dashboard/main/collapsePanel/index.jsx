import { windowsState } from "../../../../store/windows";
import { useRecoilState } from "recoil";
import {CollapsedWindow} from "../windows/collapsedWindow";
import { useCallback } from "react";
export const CollapsePanel = ({children}) => {
  const [windows, setWindows] = useRecoilState(windowsState);
  const panelStyle = {
    position: "fixed",
    bottom: 10,
    right:0,
    // backgroundColor: "red",
    height:"35px",
    width:"75vw",
    display:"flex",
    flexDirection:"row-reverse",
    zIndex:100,
    paddingRight:"5px",
    
  };
  const windowRestoreHandler = useCallback(
    (id) =>
      setWindows((prevWindows) => [
        {
          ...prevWindows[prevWindows.map((row) => row.id).indexOf(id)],
          collapse: false,
        },
        ...prevWindows.filter((window) => window.id !== id),
      ]),
    [setWindows]
  );
  return <div style={panelStyle}>
    {windows.map((window) => (
            <>
              {window.collapse === true && (
                <CollapsedWindow
                  key={window.id}
                  window={window}
                  title={
                    window.type === "bpmn"
                      ? window.data.fileName
                      : window.data.type
                  }
                  onRestore={() => windowRestoreHandler(window.id)}
                />
              )}
            </>
          ))}
  </div>;
};
