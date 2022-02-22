import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  getBpmnAssociations,
  getBpmnEntities,
  getBpmnLanes,
  getBpmnSequenceFlows,
} from "../../../../services";
import { windowsState } from "../../../../store/windows";
import { generateID } from "../../../../utils/generateID";
import styles from "../../styles.module.scss";

export const AddWindowsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setWindowsState = useSetRecoilState(windowsState);

  const onAssociationsClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnAssociations();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "BPMN Associations", associations: data.data },
        collapse:false
      },
      ...prevWindows,
    ]);

    setIsLoading(false);
  }, [setWindowsState]);

  const onEntitiesClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnEntities();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "BPMN Entities", entities: data.data },
        collapse: false,
      },
      ...prevWindows,
    ]);

    setIsLoading(false);
  }, [setWindowsState]);

  const onSequenceFlowsClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnSequenceFlows();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "BPMN SequenceFlows", sequenceFlows: data.data },
        collapse:false
      },
      ...prevWindows,
    ]);
    setIsLoading(false);
  }, [setWindowsState]);

  const onLanesClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnLanes();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "Lanes", lanes: data.data },
        collapse:false
      },
      ...prevWindows,
    ]);
    setIsLoading(false);
  }, [setWindowsState]);

  return (
    <Popover2
      // className={styles.addWindowsButton}
      // position='left-top'
      interactionKind="hover"
      content={
        <Menu>
          <MenuItem
            icon="th"
            text="Add BPMN Associations Window"
            onClick={onAssociationsClick}
          />
          <MenuItem
            icon="th"
            text="Add BPMN Entities Window"
            onClick={onEntitiesClick}
          />
          <MenuItem
            icon="th"
            text="Add BPMN SequenceFlows Window"
            onClick={onSequenceFlowsClick}
          />
          <MenuItem icon="th" text="Add Lanes Window" onClick={onLanesClick} />
        </Menu>
      }
    >
      <Button loading={isLoading} icon="plus" small />
    </Popover2>
  );
};
