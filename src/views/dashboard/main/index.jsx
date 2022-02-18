import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { Async } from "../../../components/asyncHOC";
import { windowsState } from "../../../store/windows";
import styles from "../styles.module.scss";
import { DataWindow } from "./windows/dataWindow";
import { GraphWindow } from "./windows/graphWindow";
import { CollapsedWindow } from "./windows/collapsedWindow";
import { CollapsePanel } from "./collapsePanel";
export const Main = () => {
  const [windows, setWindows] = useRecoilState(windowsState);

  const windowCloseHandler = useCallback(
    (id) =>
      setWindows((prevWindows) =>
        prevWindows.filter((window) => window.id !== id)
      ),
    [setWindows]
  );

  const windowCollapseHandler = useCallback(
    (id) =>
      setWindows((prevWindows) =>
        prevWindows.map((window) => {
          if (window.id !== id) {
            return window;
          } else {
            return { ...window, collapse: true };
          }
        })
      ),
    [setWindows]
  );

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

  return (
    <div className={styles.mainContainer}>
      <Async>
        {windows.map((window) => (
          <>
            {window.type === "bpmn" && window.collapse === false && (
              <GraphWindow
                key={window.id}
                window={window}
                onClose={() => windowCloseHandler(window.id)}
                onCollapse={() => windowCollapseHandler(window.id)}
                onRestore={() => windowRestoreHandler(window.id)}
              />
            )}
            {window.type === "data" && window.collapse === false && (
              <DataWindow
                key={window.id}
                window={window}
                onClose={() => windowCloseHandler(window.id)}
                onCollapse={() => windowCollapseHandler(window.id)}
                onRestore={() => windowRestoreHandler(window.id)}
              />
            )}
          </>
        ))}
      </Async>
      <CollapsePanel key="collapsePanel">
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
                onClose={() => windowCloseHandler(window.id)}
                onCollapse={() => windowCollapseHandler(window.id)}
                onRestore={() => windowRestoreHandler(window.id)}
              />
            )}
          </>
        ))}
      </CollapsePanel>
    </div>
  );
};
