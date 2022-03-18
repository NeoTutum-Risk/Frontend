import { windowsIds, windowsState } from "../../../../store/windows";
import { useRecoilState } from "recoil";
import { useCallback } from "react";
import CollapseWindowWrapper from "../../../../components/CollapseWindowWrapper";
export const CollapsePanel = ({children}) => {
  const [windows, setWindows] = useRecoilState(windowsState);
  const [windowsIdsList, setWindowsIdsList] = useRecoilState(windowsIds)


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
  /*
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
  */
  return <div style={panelStyle}>
    {windowsIdsList.map((windowId) => (
      <CollapseWindowWrapper
      windowId={windowId}
      />
          ))}
  </div>;
};
