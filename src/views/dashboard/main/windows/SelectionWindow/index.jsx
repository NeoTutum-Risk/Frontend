import { useRecoilCallback, useRecoilState } from "recoil";
import { DataWindow } from "../dataWindow";
import { GraphWindow } from "../graphWindow";
import { FlowChartWindow } from "../flowChartWindow";
import { CollapsedWindow } from "../collapsedWindow";
import { CollapsePanel } from "../../collapsePanel";
import { windowFamily, windowsIds } from "../../../../../store/windows";
import { useCallback } from "react";
import { RiskAssessmentWindow } from "../riskAssessmentWindow";
import { NotebookWindow } from "../notebookWindow";
import { ConsoleWindow } from "../consoleWindow";

const SelectionWindow = ({ windowId }) => {
  const [window, setWindow] = useRecoilState(windowFamily(windowId));

  /*
    const windowCloseHandler = useCallback(
        (id) =>
          setWindow((prevWindows) =>
            prevWindows.filter((window) => window.id !== id)
          ),
        [setWindow]
      );
    */

  /**
   * handles the close of the window where it removes the window atom and its id from the windows array
   */
  const windowCloseHandler = useRecoilCallback(
    ({ set, reset }) =>
      () => {
        reset(windowFamily(windowId));
        set(windowsIds, (prevValue) =>
          prevValue.filter((id) => id !== windowId)
        );
      },
    [setWindow]
  );

  /**
   * handles the collapse of the window where it makes the window atom collapse property true and its id from the windows array
   */
  const windowCollapseHandler = useCallback(
    (id) => setWindow({ ...window, collapse: true }),
    /*
          setWindow((prevWindows) =>
            prevWindows.map((window) => {
              if (window.id !== id) {
                return window;
              } else {
                return { ...window, collapse: true };
              }
            })
          )*/ [setWindow, window]
  );

  /**
   * handles the collapse of the window where it makes the window atom collapse property false and its id from the windows array
   */
  const windowRestoreHandler = useCallback(
    (id) => setWindow({ ...window, collapse: false }),
    /*
      setWindow((prevWindows) => [
        {
          ...prevWindows[prevWindows.map((row) => row.id).indexOf(id)],
          collapse: false,
        },
        ...prevWindows.filter((window) => window.id !== id),
      ])*/ [setWindow, window]
  );

  return (
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
      {window.type === "flowchart" && window.collapse === false && (
        <FlowChartWindow
          key={window.id}
          window={window}
          onClose={() => windowCloseHandler(window.id)}
          onCollapse={() => windowCollapseHandler(window.id)}
          onRestore={() => windowRestoreHandler(window.id)}
        />
      )}

      {window.type === "risk" && window.collapse === false && (
        <RiskAssessmentWindow
          key={window.id}
          window={window}
          onClose={() => windowCloseHandler(window.id)}
          onCollapse={() => windowCollapseHandler(window.id)}
          onRestore={() => windowRestoreHandler(window.id)}
        />
      )}
      {window.type === "notebook" && window.collapse === false && (
        <NotebookWindow
          key={window.id}
          window={window}
          onClose={() => windowCloseHandler(window.id)}
          onCollapse={() => windowCollapseHandler(window.id)}
          onRestore={() => windowRestoreHandler(window.id)}
        />
      )}

{window.type === "raConsole" && window.collapse === false && (
        <ConsoleWindow
          key={window.id}
          window={window}
          onClose={() => windowCloseHandler(window.id)}
          onCollapse={() => windowCollapseHandler(window.id)}
          onRestore={() => windowRestoreHandler(window.id)}
        />
      )}
    </>
  );
};

export default SelectionWindow;