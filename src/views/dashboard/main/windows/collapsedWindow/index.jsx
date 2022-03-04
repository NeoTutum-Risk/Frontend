import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  Icon,
  Intent,
  Menu,
  MenuItem,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import styles from "../../../styles.module.scss";
import { AddWindowsButton } from "../../addWindowsButton";

export const CollapsedWindow = (
  {
    icon,
    title,
    onClose,
    onCollapse,
    onRestore,
    collapseState,
    children,
    headerAdditionalContent = null,
    window
  },
  props
) => {
  let collapsedTitle;
  switch(window.type){
    case "data":
      collapsedTitle=window.data.levelName?window.data.levelName:window.data.type;
    break;

    case "flowchart":
    collapsedTitle=window.data.metaDataLevel2.name;
    break;
    default:
      collapsedTitle=title;
  }
  return (
    <Card
      className={`${styles.windowCard} `}
      style={{ height: "100%", marginLeft: "5px" }}
      elevation={Elevation.TWO}
    >
      <div className={`handle bp3-dark ${styles.windowHeader}`}>
        <div className={styles.windowHeader_title}>
          <Icon icon={icon} />
          <div className="bp3-ui-text" style={{ marginRight: "5px" }}>
            {collapsedTitle}
          </div>
        </div>

        {headerAdditionalContent}
        <ButtonGroup>
          <Tooltip2  content={<span style={{ zIndex: 200 }}>Restore</span>}>
            <Button
              onClick={onRestore}
              icon={"double-chevron-up"}
              small
              intent={Intent.PRIMARY}
            />
          </Tooltip2>
        </ButtonGroup>
      </div>
    </Card>
  );
};
