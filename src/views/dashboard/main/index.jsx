import { useCallback, useEffect, useState } from "react";
import { atom, atomFamily, useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { Async } from "../../../components/asyncHOC";
import { windowsState, windowsIds, windowAtom } from "../../../store/windows";
import styles from "../styles.module.scss";
import { DataWindow } from "./windows/dataWindow";
import { GraphWindow } from "./windows/graphWindow";
import { FlowChartWindow } from "./windows/flowChartWindow";
import { CollapsedWindow } from "./windows/collapsedWindow";
import { CollapsePanel } from "./collapsePanel";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import SelectionWindow from "./windows/SelectionWindow";
import WindowWrapper from "../../../components/WindowWrapper";

export const Main = () => {
  //const [windows, setWindows] = useRecoilState(windowsState);
  const [windowsIdsList, setWindowsIdsList] = useRecoilState(windowsIds)

  console.log(windowsIdsList)


    // handler that cancel drag if the draggable
  // section isn't the window header
  const cancelDragIfNotHeaderHandler = (event) =>
    event.target.getAttribute("name") !== "window-draggable-header"
      ? true
      : false;


      /**
       * return windowsIdsList where window collapse is false
       */
      const getUnCollapsedWindows = useRecoilCallback(
        ({ set, snapshot }) =>
          async () => {
            //const returnedWindowsIdsList = []
            const getWindowsIdsList = await snapshot.getPromise(windowsIds);

            return getWindowsIdsList.filter(async (windowId) => {
              const window = await snapshot.getPromise(windowAtom(windowId));

              return !window.collapse;
            })
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
  const onSortEnd = async ({ oldIndex, newIndex }) => {
    setWindowsIdsList(
      arrayMoveImmutable(
        await getUnCollapsedWindows(),
        oldIndex,
        newIndex
      )
    );
/*
    setWindows(
      arrayMoveImmutable(
        windows.filter((window) => !window.collapse),
        oldIndex,
        newIndex
      )
    );
    */
  };




  // to display the array of windows
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className={styles.mainContainer}>
        <Async>
          {items
  //          .filter((window) => !window.collapse)
            .map((windowId, index) => (
              <WindowWrapper
              key={`item-${windowId}`}
              windowId={windowId}
              index={index}
              />
            ))}
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
      items={windowsIdsList}
      onSortEnd={onSortEnd}
    />
  );
};
