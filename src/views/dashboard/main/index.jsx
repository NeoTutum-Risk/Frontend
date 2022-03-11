import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { Async } from "../../../components/asyncHOC";
import { windowsState } from "../../../store/windows";
import styles from "../styles.module.scss";
import { DataWindow } from "./windows/dataWindow";
import { GraphWindow } from "./windows/graphWindow";
import { FlowChartWindow } from "./windows/flowChartWindow";
import { CollapsedWindow } from "./windows/collapsedWindow";
import { CollapsePanel } from "./collapsePanel";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { Fragment } from "react";

export const Main = () => {
  const [windows, setWindows] = useRecoilState(windowsState);

  const windowCloseHandler = useCallback(
    (id) =>
      setWindows((prevWindows) =>
        prevWindows.filter((window) => window.id !== id)
      ),
    [setWindows]
  );

  // cancel draggable event if the window tab isnt the one that is being dragged
  const cancelDraggable = (e) =>
    e.target.getAttribute("name") !== "draggable-tab" ? true : false;

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

  // handles the arrangment of the new order of the elements list after the DnD happened
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setWindows(arrayMoveImmutable(windows, oldIndex, newIndex));
  };

  // to display each element
  const SortableItem = SortableElement(({ value: window }) => (
    <>
        {window.type === "bpmn" && window.collapse === false && (
          <GraphWindow
            window={window}
            onClose={() => windowCloseHandler(window.id)}
            onCollapse={() => windowCollapseHandler(window.id)}
            onRestore={() => windowRestoreHandler(window.id)}
          />
        )}
        {window.type === "data" && window.collapse === false && (
          <DataWindow
            window={window}
            onClose={() => windowCloseHandler(window.id)}
            onCollapse={() => windowCollapseHandler(window.id)}
            onRestore={() => windowRestoreHandler(window.id)}
          />
        )}
        {window.type === "flowchart" && window.collapse === false && (
          <FlowChartWindow
            window={window}
            onClose={() => windowCloseHandler(window.id)}
            onCollapse={() => windowCollapseHandler(window.id)}
            onRestore={() => windowRestoreHandler(window.id)}
          />
        )}
    </>
  ));

  // to display the array of element
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className={styles.mainContainer}>
        <Async>
          {items.map((window, index) => (
            <SortableItem
              key={`item-${window.id}`}
              index={index}
              value={window}
            />
          ))}
        </Async>
        <CollapsePanel key="collapsePanel">
          {items.map((window) => (
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
  });

  return (
    <SortableList
      shouldCancelStart={cancelDraggable}
      axis="xy"
      items={windows}
      onSortEnd={onSortEnd}
    />
  );
};
