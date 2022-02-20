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
import { windowsState } from "../../../../../store/windows";
import { useRecoilState } from "recoil";
import { useCallback } from "react";
export const Window = ({
  icon,
  title,
  onClose,
  onCollapse,
  children,
  headerAdditionalContent = null,
  windowID,
}) => {
  const [windows, setWindows] = useRecoilState(windowsState);
  const [isMaximize, setIsMaximize] = useState(false);
  const [changeTypeLoading, setChangeTypeLoading] = useState(false);

  const windowLocationHandler = useCallback(
    (id, location) => {
      const windowIndex = windows.map((window) => window.id).indexOf(id);
      const windowsLength = windows.length;
      if (location === "left" && windowIndex === 0) return;
      if (location === "right" && windowIndex === windowsLength - 1) return;
      const windowData = windows[windowIndex];
      switch (location) {
        case "left":
          const leftIndex = windowIndex - 1;
          const leftData = windows[leftIndex];
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
            });
          });
          break;

        case "right":
          const rightIndex = windowIndex + 1;
          const rightData = windows[rightIndex];
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
            });
          });
          break;

        default:
          return;
      }
    },
    [setWindows, windows]
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
        setWindows((prevWindows) =>
          prevWindows.map((window) => {
            if (window.id !== id) {
              return window;
            } else {
              return { ...window, type: "data", data: dataObject };
            }
          })
        );
        setChangeTypeLoading(false);
      } catch (error) {
        showDangerToaster(`Can't Change Window Type: ${error}`);
        setChangeTypeLoading(false);
      }
    },
    [setWindows]
  );
  return (
    <Resizable
      className={
        isMaximize ? styles.windowContainerMax : styles.windowContainer
      }
      width={500}
      height={400}
      minWidth={500}
      minHeight={300}
    >
      <Card
        className={`${styles.windowCard} `}
        style={{ width: "100%", height: "100%" }}
        elevation={Elevation.TWO}
      >
        <div className={`handle bp3-dark ${styles.windowHeader}`}>
          <div className={styles.windowHeader_title}>
            {/* {changeTypeLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
            <Icon icon={icon} />
            <div className="bp3-ui-text">{title}</div>
          </div>
          <Popover2
            content={
              <Menu>
                <MenuItem
                  icon="th"
                  text="BPMN Associations"
                  onClick={() =>
                    windowTypeHandler(windowID, "BPMN Associations")
                  }
                />
                <MenuItem
                  icon="th"
                  text="BPMN Entities"
                  onClick={() => windowTypeHandler(windowID, "BPMN Entities")}
                />
                <MenuItem
                  icon="th"
                  text="BPMN SequenceFlows"
                  onClick={() =>
                    windowTypeHandler(windowID, "BPMN SequenceFlows")
                  }
                />
                <MenuItem
                  icon="th"
                  text="Lanes"
                  onClick={() => windowTypeHandler(windowID, "Lanes")}
                />
              </Menu>
            }
          >
            <Button
              small
              loading={changeTypeLoading}
              icon="eye-open"
              text="Change Type"
            />
          </Popover2>

          {headerAdditionalContent}
          <ButtonGroup>
            <AddWindowsButton />
            <Tooltip2 content={<span>Move To left</span>}>
              <Button
                onClick={() => windowLocationHandler(windowID, "left")}
                icon={"double-chevron-left"}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2 content={<span>Move To Right</span>}>
              <Button
                onClick={() => windowLocationHandler(windowID, "right")}
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
              content={<span>{isMaximize ? "minimize" : "maximize"}</span>}
            >
              <Button
                onClick={() =>
                  setIsMaximize((prevIsMaximize) => !prevIsMaximize)
                }
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
        <div className={styles.windowBody}>{children}</div>
      </Card>
    </Resizable>
  );
};
