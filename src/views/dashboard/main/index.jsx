import { useCallback, useState } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import { Async } from "../../../components/asyncHOC";
import { windowFamily, windowsIds, windowsState } from "../../../store/windows";
import styles from "../styles.module.scss";
import { DataWindow } from "./windows/dataWindow";
import { GraphWindow } from "./windows/graphWindow";
import { FlowChartWindow } from "./windows/flowChartWindow";
import { RiskAssessmentWindow } from "./windows/riskAssessmentWindow";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import WindowWrapper from "../../../components/WindowWrapper";

export const Main = () => {
  const [windows, setWindows] = useRecoilState(windowsState);
  const [windowsIdsList, setWindowsIdsList] = useRecoilState(windowsIds);

  const windowCloseHandler = useCallback(
    (id) =>
      setWindows((prevWindows) =>
        prevWindows.filter((window) => window.id !== id)
      ),
    [setWindows]
  );

  // handler that cancel drag if the draggable
  // section isn't the window header
  const cancelDragIfNotHeaderHandler = (event) =>
    event.target.getAttribute("name") !== "window-draggable-header"
      ? true
      : false;

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

  /**
   * @description return windowsIdsList where window collapse is false
   */
  const getUnCollapsedWindows =useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        //const returnedWindowsIdsList = []
        const getWindowsIdsList = await snapshot.getPromise(windowsIds);

        return getWindowsIdsList.filter(async (windowId) => {
          const window = await snapshot.getPromise(windowFamily(windowId));

          return !window.collapse;
        });
        /*
              for (const windowId of getWindowsIdsList) {
                const window = await snapshot.getPromise(windowAtom(windowId));
                !window.collapse && returnedWindowsIdsList.push(windowId)
              }
              return returnedWindowsIdsList
              */
      },
    []
  );

  // handles the arrangment of the new order of the elements list after the DnD happened
  /*
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setWindows(
      arrayMoveImmutable(
        windows.filter((window) => !window.collapse),
        oldIndex,
        newIndex
      )
    );
  };
  */

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    setWindowsIdsList(
      arrayMoveImmutable(await getUnCollapsedWindows(), oldIndex, newIndex)
    );
  };


  // to display each window of the Draggable Windows
  const SortableItem = SortableElement(({ value: window }) => (
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
    </>
  ));


  // to display the array of windows
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className={styles.mainContainer} id="mainContainer">
        <Async>
          {
          /*
          items
            .filter((window) => !window.collapse)
            .map((window, index) => (
              <SortableItem
                key={`item-${window.id}`}
                index={index}
                value={window}
              />
            ))
          */
            items.map((windowId, index) => (
                <WindowWrapper
                key={`item-${windowId}`}
                windowId={windowId}
                index={index}
                />
              ))
              }
        </Async>
        {/* <CollapsePanel key="collapsePanel">
          
        </CollapsePanel> */}
      </div>
    );
  });

  return (
    <SortableList
      shouldCancelStart={cancelDragIfNotHeaderHandler}
      axis="xy"
      //items={windows}
      items={windowsIdsList}
      onSortEnd={onSortEnd}
    />
  );
};
