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
      () => {
        const getWindowsIdsList = snapshot.getLoadable(windowsIds).contents;
        const check = checkMaximized();
        let currentWindow;
        
        if (!check) {
          console.log("no")
          currentWindow = snapshot.getLoadable(windowFamily(windowId)).contents;
          set(windowFamily(windowId), {
            ...currentWindow,
            collapse: !currentWindow.collapse,
          });
        } else {
          console.log("u")
          getWindowsIdsList.forEach((element) => {
            // let currentWindow;
            currentWindow = snapshot.getLoadable(
              windowFamily(element)
            ).contents;
            if (element === windowId) {
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
              : `${window.data.name} (${window.type})`
          }
          onRestore={() => windowRestoreHandler(window.id)}
        />
      )}
    </>
  );
};

export default CollapseWindowWrapper;
