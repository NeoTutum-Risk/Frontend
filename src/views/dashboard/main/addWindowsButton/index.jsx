import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useCallback, useState } from "react";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import {
  getBpmnAssociations,
  getBpmnEntities,
  getBpmnLanes,
  getBpmnSequenceFlows,
} from "../../../../services";
import { windowAtom, windowsIds, windowsState } from "../../../../store/windows";
import { generateID } from "../../../../utils/generateID";
import { windowDefault } from "../../../../constants";
export const AddWindowsButton = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const setWindowsState = useSetRecoilState(windowsState);

  const onAssociationsClick = useRecoilCallback(
    ({ set }) =>
      async () => {
        setIsLoading(true);
        const { data } = await getBpmnAssociations();
        const id = generateID();
        const windowData = {
          type: "data",
          data: { type: "BPMN Associations", associations: data.data },
          id,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        };
        console.log(windowData)
        set(windowsIds, (prev) => [id, ...prev])
        set(windowAtom(id), windowData)
        setIsLoading(false);
      },
    []
  );

  /*
  const onAssociationsClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnAssociations();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "BPMN Associations", associations: data.data },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      },
      ...prevWindows,
    ]);

    setIsLoading(false);
  }, [setWindowsState]);
  */

  const onEntitiesClick = useRecoilCallback(
    ({ set }) =>
      async () => {
        setIsLoading(true);
        const { data } = await getBpmnEntities();
        const id = generateID();
        const windowData = {
          type: "data",
          data: { type: "BPMN Entities", entities: data.data },
          id,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        };
        set(windowsIds, (prev) => [id, ...prev]);
        set(windowAtom(id), windowData);
      },
    []
  );

  /*
  const onEntitiesClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnEntities();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "BPMN Entities", entities: data.data },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      },
      ...prevWindows,
    ]);

    setIsLoading(false);
  }, [setWindowsState]);
  */

  const onSequenceFlowsClick = useRecoilCallback(
    ({ set }) =>
      async () => {
        setIsLoading(true);
        const { data } = await getBpmnSequenceFlows();
        const id = generateID();
        const windowData = {
          type: "data",
          data: { type: "BPMN SequenceFlows", sequenceFlows: data.data },
          id,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        };
        set(windowsIds, (prev) => [id, ...prev]);
        set(windowAtom(id), windowData);
      },
    []
  );

  /*
  const onSequenceFlowsClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnSequenceFlows();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "BPMN SequenceFlows", sequenceFlows: data.data },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      },
      ...prevWindows,
    ]);
    setIsLoading(false);
  }, [setWindowsState]);
  */

  const onLanesClick = useRecoilCallback(
    ({ set }) =>
      async () => {
        setIsLoading(true);
        const { data } = await getBpmnLanes();
        const id = generateID();
        const windowData = {
          type: "data",
          data: { type: "Lanes", lanes: data.data },
          id,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        };
        set(windowsIds, (prev) => [id, ...prev]);
        set(windowAtom(id), windowData);
      },
    []
  );

  /*
  const onLanesClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnLanes();
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "Lanes", lanes: data.data },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      },
      ...prevWindows,
    ]);
    setIsLoading(false);
  }, [setWindowsState]);
  */

  const onLevelClick = useRecoilCallback(
    ({ set }) =>
      async (id) => {
        const levelData = data.data.dataObjectLevels.find(
          (level) => level.id === id
        );
        const generatedId = generateID();
        const windowData = {
          type: "data",
          data: {
            type: "Level Data",
            levelName: levelData.name,
            levelDataObject: data.data.id,
            levelData: levelData.dataObjectElements.map((element) => ({
              id: element.id,
              label: element.label,
              levelId: element.levelId,
              name: element.name,
              status: element.status,
              ConnectedTo:
                element.dataObjectConnections.length > 0
                  ? element.dataObjectConnections.reduce((con, acc) => {
                      console.log(
                        "elements",
                        data.data.dataObjectLevels
                          .flat()
                          .map((level) => level.dataObjectElements)
                          .flat()
                      );
                      const returned = (con += ` ${
                        data.data.dataObjectLevels
                          .flat()
                          .map((level) => level.dataObjectElements)
                          .flat()
                          .find((item) => item.id === acc.targetId).label
                      }`);
                      console.log("reduce", returned);
                      return returned;
                    }, "")
                  : "",
            })),
          },
          id: generatedId,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        };
        set(windowsIds, (prev) => [id, ...prev]);
        set(windowAtom(id), windowData);
      },
    []
  );

  /*
  const onLevelClick = useCallback(
    (id) => {
      const levelData = data.data.dataObjectLevels.find(
        (level) => level.id === id
      );
      setWindowsState((prevWindows) => [
        {
          id: generateID(),
          type: "data",
          data: {
            type: "Level Data",
            levelName: levelData.name,
            levelDataObject: data.data.id,
            levelData: levelData.dataObjectElements.map((element) => ({
              id: element.id,
              label: element.label,
              levelId: element.levelId,
              name: element.name,
              status: element.status,
              ConnectedTo:
                element.dataObjectConnections.length > 0
                  ? element.dataObjectConnections.reduce((con, acc) => {
                      console.log(
                        "elements",
                        data.data.dataObjectLevels
                          .flat()
                          .map((level) => level.dataObjectElements)
                          .flat()
                      );
                      const returned = (con += ` ${
                        data.data.dataObjectLevels
                          .flat()
                          .map((level) => level.dataObjectElements)
                          .flat()
                          .find((item) => item.id === acc.targetId).label
                      }`);
                      console.log("reduce", returned);
                      return returned;
                    }, "")
                  : "",
            })),
          },
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        },
        ...prevWindows,
      ]);
      setIsLoading(false);
      console.log(levelData);
    },
    [data.data.dataObjectLevels, setWindowsState,data.data.id]
  );
  */

  return (
    <Popover2
      // className={styles.addWindowsButton}
      // position='left-top'
      interactionKind="hover"
      content={
        <Menu>
          {data.type === "flowchart" ? (
            <>
              {data.data.dataObjectLevels.map((level) => (
                <MenuItem
                  icon="th"
                  text={level.name}
                  onClick={() => onLevelClick(level.id)}
                />
              ))}
            </>
          ) : (
            <>
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
              <MenuItem
                icon="th"
                text="Add Lanes Window"
                onClick={onLanesClick}
              />
            </>
          )}
        </Menu>
      }
    >
      <Button loading={isLoading} icon="plus" small />
    </Popover2>
  );
};
