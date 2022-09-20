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

  // function for onRiskObjectProperties
  const onRiskObjectPropertiesRecoilCallback = useRecoilCallback(({set}) => async (response)=>{
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
  },[selectedObjects,setWindowsState]);

  const onRiskObjectProperties = useCallback(async () => {
    setIsLoading(true);
    const ids = selectedObjects.map(object=>object.id);
    const payload = {ids:[...new Set([...ids])]};
    const response = await getRiskObjectProperties(payload);
    setSelectedObjects([]);

    onRiskObjectPropertiesRecoilCallback(response)
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
  }, [])

  // function for onRiskAssessmentPhysicalTable
  const onRiskAssessmentPhysicalTableRecoilCallback = useRecoilCallback( ({set}) =>
    async (name, preparedData) => {
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
    },
    [setWindowsState]
  );

  const onRiskAssessmentPhysicalTable = useCallback(async(id, name) => {
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

    onRiskAssessmentPhysicalTableRecoilCallback(id, preparedData)
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
  }, [])

  // function for onRiskAssessmentTable
  const onRiskAssessmentTableRecoilCallback = useRecoilCallback( ({set}) =>
    async (name, data) => {
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
    },
    [setWindowsState]
  );

    const onRiskAssessmentTable = useCallback(async (id, name) => {
      setIsLoading(true);

      const { data } = await getRiskAssessmentTable(id);

      onRiskAssessmentTableRecoilCallback(name, data)
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
    }, [])

    // function for onAssociationsClick
  const onAssociationsRecoilCallback = useRecoilCallback(({set}) => (data) => {
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
  }, [setWindowsState]);

  const onAssociationsClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnAssociations()

    onAssociationsRecoilCallback(data)
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
  }, [])
  
  // function for onEntitiesClick
  const onEntitiesRecoilCallback = useRecoilCallback( ({set}) => async (data) => {
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
  }, [setWindowsState]);

  const onEntitiesClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnEntities();

    onEntitiesRecoilCallback(data)
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
  }, [])

  // function for onSequenceFlowsClick
  const onSequenceFlowsRecoilCallback = useRecoilCallback( ({ set }) => (data) => {
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
  }, [setWindowsState]);

  const onSequenceFlowsClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnSequenceFlows();

    onSequenceFlowsRecoilCallback(data)
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
  }, [])

  // function for onLanesClick
  const onLanesRecoilCallback = useRecoilCallback(({ set }) => async (data) => {
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


  }, [setWindowsState]);


  const onLanesClick = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getBpmnLanes();

    onLanesRecoilCallback(data)
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
  }, [])

  // function for onLevelClick
  const onLevelRecoilCallback = useRecoilCallback(({set}) =>
    (levelData) => {
      const generatedId = generateID()

      const windowData = {
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
    },
    [data.data.dataObjectLevels, setWindowsState, data.data.id]
  );
  
  const onLevelClick = useCallback(async (id) => {
    setIsLoading(true)
    const levelData = data.data.dataObjectLevels.find(
      (level) => level.id === id
    );

    onLevelRecoilCallback(levelData)
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
  }, [])

  return (
    <Popover2
      // className={styles.addWindowsButton}
      // position='left-top'
      interactionKind="hover"
      content={
        <Menu>
          {data.type === "flowchart" ? (
            <>
              {/* {data.data.dataObjectLevels.map((level) => (
                <MenuItem
                  icon="th"
                  text={level.name}
                  onClick={() => onLevelClick(level.id)}
                />
              ))} */}
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
