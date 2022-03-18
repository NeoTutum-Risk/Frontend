import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { windowAtom } from "../../store/windows";
import { CollapsedWindow } from "../../views/dashboard/main/windows/collapsedWindow";

const CollapseWindowWrapper = ({windowId, }) => {

    const [window, setWindow] = useRecoilState(windowAtom(windowId));


    const windowRestoreHandler = useCallback(
        (id) => setWindow({ ...window, collapse: false }),
        [setWindow, window]
      );


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
                : window.data.type
            }
            onRestore={() => windowRestoreHandler(window.id)}
          />
        )}
      </>
    )
}

export default CollapseWindowWrapper