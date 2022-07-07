import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useCallback, useState } from "react";
import { useSetRecoilState,useRecoilState, useRecoilCallback } from "recoil";
import {
  getBpmnAssociations,
  getBpmnEntities,
  getBpmnLanes,
  getBpmnSequenceFlows,
  getRiskAssessmentTable,
  getRiskAssessmentPhysicalTable,
  getRiskObjectProperties
} from "../../../../services";
import { windowFamily, windowsIds,windowsState } from "../../../../store/windows";
import { generateID } from "../../../../utils/generateID";
import { windowDefault } from "../../../../constants";
import {objectSelectorState} from "../../../../store/objectSelector"

export const AddWindowsButton = ({ data }) => {

  const [selectedObjects, setSelectedObjects] = useRecoilState(objectSelectorState);

  const [isLoading, setIsLoading] = useState(false);
  const setWindowsState = useSetRecoilState(windowsState);

  const onRiskObjectProperties = useRecoilCallback(({set}) => async ()=>{
    setIsLoading(true);
    const ids = selectedObjects.map(object=>object.id);
    const payload = {ids:[...new Set([...ids])]};
    const response = await getRiskObjectProperties(payload);
    setSelectedObjects([]);

    const generatedId = generateID()

    const windowData = {
      id: generatedId,
      type: "data",
      data: { type: "riskTable", name:"Risk Object(s) Properties", riskTable: response.data.data },
      collapse: false,
      width: windowDefault.width,
      height: windowDefault.height,
      maximized: false,
    }
    set(windowsIds, (prev) => [generatedId, ...prev])
    set(windowFamily(generatedId), windowData)

    /*
    setWindowsState((prevWindows) => [
      {
        id: generateID(),
        type: "data",
        data: { type: "riskTable", name:"Risk Object(s) Properties", riskTable: response.data.data },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      },
      ...prevWindows,
    ]);
    */

    setIsLoading(false);
  },[selectedObjects,setWindowsState]);

  const onRiskAssessmentPhysicalTable = useRecoilCallback( ({set}) =>
    async (id, name) => {
      setIsLoading(true);
      const { data } = await getRiskAssessmentPhysicalTable(id);
      const preparedData = data.data.map((object) => {
        console.log("properties", object.riskObjectProperties);
        return {
          id: object.id,
          name: object.name,
          bpmnDataObjectId: object.bpmnDataObjectId,
          fileId: object.fileId,
          riskObjectProperties: object?.riskObjectProperties
            ? object.riskObjectProperties.reduce((con, acc) => {
                const returned =
                  (con += ` ${acc.metaDataLevel2Id}-${acc.dataObjectElementId}`);
                return returned;
              }, "")
            : null,
        };
      });

      const generatedId = generateID()

      const windowData = {
        id: generatedId,
        type: "data",
        data: { type: "riskPhysicalTable", name, riskTable: preparedData },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      }
      set(windowsIds, (prev) => [generatedId, ...prev])
      set(windowFamily(generatedId), windowData)

      /*
      setWindowsState((prevWindows) => [
        {
          id: generateID(),
          type: "data",
          data: { type: "riskPhysicalTable", name, riskTable: preparedData },
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        },
        ...prevWindows,
      ]);
      */

      setIsLoading(false);
    },
    [setWindowsState]
  );

  const onRiskAssessmentTable = useRecoilCallback( ({set}) =>
    async (id, name) => {
      setIsLoading(true);
      const { data } = await getRiskAssessmentTable(id);

      const generatedId = generateID()

      const windowData = {
        id: generatedId,
        type: "data",
        data: { type: "riskTable", name, riskTable: data.data },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      }

      set(windowsIds, (prev) => [generatedId, ...prev])
      set(windowFamily(generatedId), windowData)

      /*
      setWindowsState((prevWindows) => [
        {
          id: generateID(),
          type: "data",
          data: { type: "riskTable", name, riskTable: data.data },
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: false,
        },
        ...prevWindows,
      ]);
      */

      setIsLoading(false);
    },
    [setWindowsState]
  );

  const onAssociationsClick = useRecoilCallback(({set}) => async () => {
    setIsLoading(true);
    const { data } = await getBpmnAssociations();

    const generatedId = generateID();

    const windowData = {
      id: generatedId,
      type: "data",
      data: { type: "BPMN Associations", associations: data.data },
      collapse: false,
      width: windowDefault.width,
      height: windowDefault.height,
      maximized: false,
    }
    set(windowsIds, (prev) => [generatedId, ...prev])
    set(windowFamily(generatedId), windowData)

    /*
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
    */

    setIsLoading(false);
  }, [setWindowsState]);

  const onEntitiesClick = useRecoilCallback( ({set}) => async () => {
    setIsLoading(true);
    const { data } = await getBpmnEntities();

    const generatedId = generateID()

    const windowData = {
      id: generatedId,
      type: "data",
      data: { type: "BPMN Entities", entities: data.data },
      collapse: false,
      width: windowDefault.width,
      height: windowDefault.height,
      maximized: false,
    }
    set(windowsIds, (prev) => [generatedId, ...prev])
    set(windowFamily(generatedId), windowData)

    /*
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
    */

    setIsLoading(false);
  }, [setWindowsState]);

  const onSequenceFlowsClick = useRecoilCallback( ({ set }) => async () => {
    setIsLoading(true);
    const { data } = await getBpmnSequenceFlows();

    const generatedId = generateID()

    const windowData = {
      id: generatedId,
      type: "data",
      data: { type: "BPMN SequenceFlows", sequenceFlows: data.data },
      collapse: false,
      width: windowDefault.width,
      height: windowDefault.height,
      maximized: false,
    }
    set(windowsIds, (prev) => [generatedId, ...prev])
    set(windowFamily(generatedId), windowData)

    /*
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
    */
    setIsLoading(false);
  }, [setWindowsState]);

  const onLanesClick = useRecoilCallback(({ set }) => async () => {
    setIsLoading(true);
    const { data } = await getBpmnLanes();

    const generatedId = generateID()

    const windowData = {
      id: generatedId,
      type: "data",
      data: { type: "Lanes", lanes: data.data },
      collapse: false,
      width: windowDefault.width,
      height: windowDefault.height,
      maximized: false,
    }
    set(windowsIds, (prev) => [generatedId, ...prev])
    set(windowFamily(generatedId), windowData)

/*
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
    */
    setIsLoading(false);
  }, [setWindowsState]);

  const onLevelClick = useRecoilCallback(({set}) =>
    (id) => {
      const levelData = data.data.dataObjectLevels.find(
        (level) => level.id === id
      );

      const generatedId = generateID()

      const windowData =         {
        id: generatedId,
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
                    const returned = (con += ` ${
                      data.data.dataObjectLevels
                        .flat()
                        .map((level) => level.dataObjectElements)
                        .flat()
                        .find((item) => item.id === acc.targetId).label
                    }`);
                    return returned;
                  }, "")
                : "",
          })),
        },
        collapse: false,
        width: windowDefault.width,
        height: windowDefault.height,
        maximized: false,
      }
      set(windowsIds, (prev) => [generatedId, ...prev])
      set(windowFamily(generatedId), windowData)

      /*
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
                      const returned = (con += ` ${
                        data.data.dataObjectLevels
                          .flat()
                          .map((level) => level.dataObjectElements)
                          .flat()
                          .find((item) => item.id === acc.targetId).label
                      }`);
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
      */
      setIsLoading(false);
      console.log(levelData);
    },
    [data.data.dataObjectLevels, setWindowsState, data.data.id]
  );

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
          ) : data.type === "risk" ? (
            <>
              <MenuItem
                icon="th"
                text="Risk Assessment Data"
                onClick={() =>
                  onRiskAssessmentTable(data.data.id, data.data.name)
                }
              />
              <MenuItem
                icon="th"
                text="Physical Objects Data"
                onClick={() =>
                  onRiskAssessmentPhysicalTable(data.data.id, data.data.name)
                }
              />
              <MenuItem
                icon="th"
                text="Risk Objects Properties"
                onClick={onRiskObjectProperties}
              />
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
