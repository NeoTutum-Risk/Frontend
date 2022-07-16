import { useCallback } from "react";
import { useRecoilState, useSetRecoilState, useRecoilCallback } from "recoil";
import { windowFamily, windowsIds } from "../../store/windows";
import { CollapsedWindow } from "../../views/dashboard/main/windows/collapsedWindow";

const CollapseWindowWrapper = ({ windowId }) => {
  const [windowsIdsList, setWindowsIdsList] = useRecoilState(windowsIds);
  const [window, setWindow] = useRecoilState(windowFamily(windowId));

  const checkMaximized = useRecoilCallback(
    ({ set, snapshot }) =>
      () => {
        const getWindowsIdsList = snapshot.getLoadable(windowsIds).contents;

        return getWindowsIdsList.find(
          (element) =>
            snapshot.getLoadable(windowFamily(element)).contents.maximized
        );
      },
    []
  );

  const windowRestoreHandler = useRecoilCallback(
    ({ set, snapshot }) =>
      async (windowIdn) => {
        const getWindowsIdsList = await snapshot.getLoadable(windowsIds).contents;
        const check = checkMaximized();
        let currentWindow;
        
        if (!check) {
          
          currentWindow = await snapshot.getLoadable(windowFamily(windowId)).contents;
          set(windowFamily(windowIdn), {
            ...currentWindow,
            collapse: !currentWindow.collapse,
          });
        } else {
          
          getWindowsIdsList.forEach(async (element) => {
            // let currentWindow;
            currentWindow = await snapshot.getLoadable(
              windowFamily(element)
            ).contents;
            
            if (element === windowIdn) {
              set(windowFamily(element), {
                ...currentWindow,
                maximized: true,
                collapse:false
              });
            } else {
              set(windowFamily(element), {
                ...currentWindow,
                collapse: true,
                maximized: false,
              });
            }
          });
        }
      },
    []
  );

  // const windowRestoreHandler = useCallback(
  //     (id) => setWindow({ ...window, collapse: false }),
  //     [setWindow, window]
  //   );

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

  return (
    <>
      {window.collapse === true && (
        <CollapsedWindow
          window={window}
          title={
            window.type === "bpmn"
            ? window.data.fileName
            : window.data.type === "Level Data"
            ? window.data.levelName
            : window.type === "riskTable"
            ? window.data.name + " Data"
            : window.data.type === "riskPhysicalTable"
            ? window.data.name + " Physical RO"
            : window.data.name + "risk"
            ? window.data.name
            : window.data.type
          }
          onRestore={() => windowRestoreHandler(window.id)}
        />
      )}
    </>
  );
};

export default CollapseWindowWrapper;
