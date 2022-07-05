import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  Icon,
  Intent,
  Menu,
  MenuItem,
  // Spinner,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import React, { useState } from "react";
// import { ResizableBox } from "react-resizable";
import Resizable from "react-resizable-box";
import styles from "../../../styles.module.scss";
import { AddWindowsButton } from "../../addWindowsButton";
import {
  getBpmnAssociations,
  getBpmnEntities,
  getBpmnLanes,
  getBpmnSequenceFlows,
} from "../../../../../services";
import {
  showWarningToaster,
  showDangerToaster,
} from "../../../../../utils/toaster";
import { windowFamily, windowsIds, windowsState } from "../../../../../store/windows";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useCallback } from "react";
export const Window = ({
  icon,
  title,
  onClose,
  onCollapse,
  children,
  headerAdditionalContent = null,
  window,
}) => {
  const [windows, setWindows] = useRecoilState(windowsState);
  const [windowsIdsList, setWindowsIdsList] = useRecoilState(windowsIds)
  const setWindow = useSetRecoilState(windowFamily(window.id))
  const [isMaximize, setIsMaximize] = useState(false);
  const [changeTypeLoading, setChangeTypeLoading] = useState(false);

  const windowLocationHandler = useCallback(
    (id, location) => {
      //const windowIndex = windows.map((window) => window.id).indexOf(id);
      const windowIndex = windowsIdsList.map(windowId => windowId).indexOf(id);

      //const windowsLength = windows.length;
      const windowsLength = windowsIdsList.length;
      if (location === "left" && windowIndex === 0) return;
      if (location === "right" && windowIndex === windowsLength - 1) return;
      //const windowData = windows[windowIndex];
      const windowData = windowsIdsList[windowIndex];
      switch (location) {
        case "left":
          const leftIndex = windowIndex - 1;
          //const leftData = windows[leftIndex];
          const leftData = windowsIdsList[leftIndex];

          setWindowsIdsList(prevWindowsIds => {
            return prevWindowsIds.map((windowId, index) => {
              if (index !== windowIndex && index !== leftIndex) {
                return windowId;
              }
              if (index === windowIndex) {
                return leftData;
              }
              if (index === leftIndex) {
                return windowData;
              }

              return {};
            });
          })

          /*
          setWindows((prevWindows) => {
            return prevWindows.map((window, index) => {
              if (index !== windowIndex && index !== leftIndex) {
                return window;
              }
              if (index === windowIndex) {
                return leftData;
              }
              if (index === leftIndex) {
                return windowData;
              }

              return {};
            });
          })
            */
          break;

        case "right":
          const rightIndex = windowIndex + 1;
          //const rightData = windows[rightIndex];
          const rightData = windowsIdsList[rightIndex];

          setWindowsIdsList(prevWindowsIds => {
            return prevWindowsIds.map((windowId, index) => {
              if (index !== windowIndex && index !== rightIndex) {
                return windowId;
              }
              if (index === windowIndex) {
                return rightData;
              }
              if (index === rightIndex) {
                return windowData;
              }

              return {};
            });
          })
          /*
          setWindows((prevWindows) => {
            return prevWindows.map((window, index) => {
              if (index !== windowIndex && index !== rightIndex) {
                return window;
              }
              if (index === windowIndex) {
                return rightData;
              }
              if (index === rightIndex) {
                return windowData;
              }

              return {};
            });
          });
          */
          break;

        default:
          return;
      }
    },
    [setWindows, windows, setWindowsIdsList, window, windowsIdsList]
  );

  const windowTypeHandler = useCallback(
    async (id, type) => {
      try {
        setChangeTypeLoading(true);
        let dataObject = {};
        switch (type) {
          case "BPMN Associations":
            const associations = await getBpmnAssociations();
            dataObject["associations"] = associations.data.data;
            dataObject["type"] = "BPMN Associations";
            break;
          case "BPMN Entities":
            const entities = await getBpmnEntities();
            dataObject["entities"] = entities.data.data;
            dataObject["type"] = "BPMN Entities";
            break;
          case "BPMN SequenceFlows":
            const sequenceFlows = await getBpmnSequenceFlows();
            dataObject["sequenceFlows"] = sequenceFlows.data.data;
            dataObject["type"] = "BPMN SequenceFlows";
            break;
          case "Lanes":
            const lanes = await getBpmnLanes();
            dataObject["lanes"] = lanes.data.data;
            dataObject["type"] = "Lanes";
            break;
          default:
            showWarningToaster(`Worng Type Selection`);
        }
        /*
        setWindows((prevWindows) =>
          prevWindows.map((window) => {
            if (window.id !== id) {
              return window;
            } else {
              return { ...window, type: "data", data: dataObject };
            }
          })
        );
        */
        setWindow({...window, type: "data", data: dataObject})
        setChangeTypeLoading(false);
      } catch (error) {
        showDangerToaster(`Can't Change Window Type: ${error}`);
        setChangeTypeLoading(false);
      }
    },
    [setWindows, setWindow, window]
  );

  const handleWindowResize = useCallback(
    (delta) => {
      /*
      setWindows((prev) =>
        prev.map((storedWindow) => {
          if (storedWindow.id === window.id) {
            return {
              ...storedWindow,
              width: storedWindow.width + delta.width,
              height: storedWindow.height + delta.height,
            };
          } else {
            return storedWindow;
          }
        })
      );
      */

      setWindow({
        ...window,
        width: window.width + delta.width,
        height: window.height + delta.height
       })
    },
    [setWindows, window.id, setWindow, window]
  );

  const handleMaximize = useCallback(() => {
    /*
    setWindows((prev) =>
      prev.map((storedWindow) => {
        if (storedWindow.id === window.id) {
          return {
            ...storedWindow,
            maximized: !storedWindow.maximized,
          };
        } else {
          return storedWindow;
        }
      })
    );
    */
    setWindow({
      ...window,
     maximized: !window.maximized
   })
  }, [setWindows, window.id, setWindow, window]);
  return (
    <Resizable
      className={
        window.maximized ? styles.windowContainerMax : styles.windowContainer
      }
      width={window.width}
      height={window.height}
      minWidth={500}
      minHeight={320}
      onResizeStop={(e, d, r, delta) => handleWindowResize(delta)}
    >
      <Card
        className={`${styles.windowCard} `}
        style={{ width: "100%", height: "100%" }}
        elevation={Elevation.TWO}
      >
        <div
          name="window-draggable-header"
          className={`handle bp3-dark ${styles.windowHeader}`}
        >
          <div className={styles.windowHeader_title}>
            {/* {changeTypeLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
            <Icon icon={icon} />
            <div className="bp3-ui-text">{title}</div>
          </div>
          {window.type === "flowchart" ||
          window.type === "risk" ||
          window.data.type === "riskTable" ||
          (window.type === "data" && window.data.levelName) ? null : (
            <Popover2
              content={
                <Menu>
                  <MenuItem
                    icon="th"
                    text="BPMN Associations"
                    onClick={() =>
                      windowTypeHandler(window.id, "BPMN Associations")
                    }
                  />
                  <MenuItem
                    icon="th"
                    text="BPMN Entities"
                    onClick={() =>
                      windowTypeHandler(window.id, "BPMN Entities")
                    }
                  />
                  <MenuItem
                    icon="th"
                    text="BPMN SequenceFlows"
                    onClick={() =>
                      windowTypeHandler(window.id, "BPMN SequenceFlows")
                    }
                  />
                  <MenuItem
                    icon="th"
                    text="Lanes"
                    onClick={() => windowTypeHandler(window.id, "Lanes")}
                  />
                </Menu>
              }
            >
              <Button
                small
                loading={changeTypeLoading}
                icon="eye-open"
                text="Type"
              />
            </Popover2>
          )}

          {headerAdditionalContent}
          <ButtonGroup>
            {(window.type === "data" && window.data.levelName) ||
            window.data.type === "riskTable" ? null : (
              <AddWindowsButton data={window} />
            )}
            <Tooltip2 content={<span>Move To left</span>}>
              <Button
                onClick={() => windowLocationHandler(window.id, "left")}
                icon={"double-chevron-left"}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2 content={<span>Move To Right</span>}>
              <Button
                onClick={() => windowLocationHandler(window.id, "right")}
                icon={"double-chevron-right"}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2 content={<span>Collapse</span>}>
              <Button
                onClick={onCollapse}
                icon={"double-chevron-down"}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2
              content={
                <span>{window.maximized ? "minimize" : "maximize"}</span>
              }
            >
              <Button
                onClick={handleMaximize}
                icon={isMaximize ? "minimize" : "maximize"}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2 content={<span>close</span>}>
              <Button
                onClick={onClose}
                icon="cross"
                intent={Intent.DANGER}
                small
              />
            </Tooltip2>
          </ButtonGroup>
        </div>
        <div className={window.type==="risk0"?styles.windowBodyScroll:styles.windowBody}>{children}</div>
      </Card>
    </Resizable>
  );
};
