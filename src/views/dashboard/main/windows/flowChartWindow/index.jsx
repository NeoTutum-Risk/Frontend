import { Intent, Spinner, Switch } from "@blueprintjs/core";
import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Bpmn } from "../../../../../components/bpmn";
import {
  addNewElementsConnection,
  getDataObjectConnections,
  getDataObject,
  removeNewElementsConnection,
  updateDataObjectElement,
  addElementGroup,
  updateElementGroup,
  addElementToGroup,
  removeElementFromGroup,
} from "../../../../../services";
import { platformState } from "../../../../../store/portfolios";
import { elementSelectorState } from "../../../../../store/elementSelector";
import { showDangerToaster } from "../../../../../utils/toaster";
import { Window } from "../window";
import { FlowChart } from "../../../../../components/FlowChart";
import { FloatingContext } from "../../../../../components/FlowChart/context/floatingContext";
import { ContextMenuComponent } from "../../../../../components/FlowChart/context/contextMenuComponent";
import { type } from "@testing-library/user-event/dist/type";
import { GroupFrom } from "../../../../../components/FlowChart/forms/groupForm";
import { find } from "lodash";
import React,{ useMemo } from "react";
export const FlowChartWindow = React.memo(({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [refGroupData, setRefGroupData] = useState(null);
  const [edges, setEdges] = useState([]);
  console.log("Window Data", window.data);
  const [preparedNodes, setPreparedNodes] = useState([]);

  const [objects, setObjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [connections, setConnections] = useState([]);
  const [tempConnections, setTempConnections] = useState([]);
  const [globalViewIndex, setGlobalViewIndex] = useState(1);

  const [contextMenu, setContextMenu] = useState({
    active: false,
    type: "",
    x: 0,
    y: 0,
    contextX: 0,
    contextY: 0,
    element: null,
  });

  const [views, setViews] = useState(["mini", "default", "open", "full"]);

  const [emptySpace, setEmptySpace] = useState(true);

  const [selectedElements, setSelectedElements] = useState([]);
  const [objectMenu, setObjectMenu] = useState([]);

  const getData = useCallback(async () => {
    try {
      const response = await getDataObject(window.data.id);
      if (response.status >= 200 && response.status < 300) {
        setObjects(response.data.data.refDataObjectElements);
        setGroups(response.data.data.refDataObjectGroups);
        setConnections(response.data.data.refDataObjectConnections);
      } else {
        throw Error(`Operation Faild`);
      }
    } catch (error) {
      showDangerToaster(error);
    }
  }, [window.data.id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const resetContext = useCallback(() => {
    setContextMenu({
      active: false,
      type: "",
      x: 0,
      y: 0,
      contextX: 0,
      contextY: 0,
      offsetX: 0,
      offsetY: 0,
      element: null,
    });
  }, []);

  const connectObjects = useCallback(async ({ sourceId, targetId }) => {
    console.log(`Connecting ${sourceId} &  ${targetId}`);
    try {
      setTempConnections((prev) => [
        ...prev,
        { id: `${sourceId}-${targetId}`, sourceId, targetId },
      ]);
      const response = await addNewElementsConnection({ sourceId, targetId });
      if (response.status >= 200 && response.status < 300) {
        setConnections((prev) => [...prev, response.data.data]);
        setSelectedElements([]);
        setTempConnections((prev) =>
          prev.filter((con) => con.id !== `${sourceId}-${targetId}`)
        );
      } else {
        throw Error(`Request Faild`);
      }
    } catch (error) {
      showDangerToaster(`Error: ${error}`);
    }
  }, []);

  const disconnectObjects = useCallback(async (id) => {
    console.log(`Disconnecting ${id}`);
    try {
      const response = await removeNewElementsConnection({ id });
      if (response.status >= 200 && response.status < 300) {
        setConnections((prev) => prev.filter((con) => con.id !== id));
        setSelectedElements([]);
      } else {
        throw Error(`Request Faild`);
      }
    } catch (error) {
      showDangerToaster(`Error: ${error}`);
    }
  }, []);

  const groupObjects = useCallback(
    async ({ newGroupName, newGroupDesc }) => {
      console.log(`New Group`);
      try {
        const payload = {
          refDataObjects: selectedElements.map((element) => element.id),
          dataObjectId: window.data.id,
          name: newGroupName,
          description: newGroupDesc,
          y: selectedElements[selectedElements.length - 1].y + 150,
          x: selectedElements[selectedElements.length - 1].x,
          expanded: 0,
        };
        const response = await addElementGroup(payload);
        if (response.status >= 200 && response.status < 300) {
          let group = {...response.data.data,elements:[...selectedElements]}
          setSelectedElements([]);
          // setTimeout(getData, 5000);
          //
          // return "Done";

          // setObjects((prev) =>
          //   prev.filter(
          //     (obj) => !payload.refDataObjects.find((rdo) => rdo === obj.id)
          //   )
          // );
          setObjects((prev) =>
            prev.map(
              (obj) => !payload.refDataObjects.find((rdo) => rdo === obj.id)?obj:null
            )
          );
          setGroups(prev=>[...prev,group])
        } else {
          throw Error(`Request Faild`);
        }
      } catch (error) {
        showDangerToaster(`Error: ${error}`);
        // return "Faild";
      }
    },
    [selectedElements, window.data.id]
  );

  const ungroupObjects = useCallback(async () => {}, []);

  const addToGroup = useCallback(async () => {}, []);

  const removeFromGroup = useCallback(async () => {}, []);

  const updateObject = useCallback(async (id, payload) => {
    console.log(`Updating ${id}`);
    try {
      const response = await updateDataObjectElement(id, payload);
      if (response.status >= 200 && response.status < 300) {
        setObjects((prev) =>
          prev.map((obj) => (obj.id !== id ? obj : { ...obj, ...payload }))
        );
        return "Done";
      } else {
        throw Error(`Request Faild`);
      }
    } catch (error) {
      showDangerToaster(`Error: ${error}`);
      return "Faild";
    }
  }, []);

  useEffect(() => {
    resetContext();
    if (selectedElements.length === 2) {
      if (
        Math.abs(
          selectedElements[0].levelValue - selectedElements[1].levelValue
        ) === 1
      ) {
        const sourceId =
          selectedElements[0].levelValue < selectedElements[1].levelValue
            ? selectedElements[0].id
            : selectedElements[1].id;
        const targetId =
          selectedElements[1].levelValue > selectedElements[0].levelValue
            ? selectedElements[1].id
            : selectedElements[0].id;

        // console.log("A7A Check",selectedElements,sourceId,targetId)
        let singularityCheck = true;
        let groupedElements = [];
        selectedElements.forEach((element) => {
          if (!objects.find((obj) => obj.id === element.id))
            singularityCheck = false;
          groupedElements.push(element.id);
        });
        let connectionId = connections.find(
          (connections) =>
            connections.sourceId === sourceId &&
            connections.targetId === targetId
        )?.id;

        setObjectMenu([
          {
            name: connectionId ? "Disconnect" : "Connect",
            handleClick: connectionId
              ? () => disconnectObjects(connectionId)
              : () => connectObjects({ sourceId, targetId }),
          },
          {
            name: singularityCheck ? "Group" : "Ungroup",
            handleClick: singularityCheck
              ? () => setContextMenu((prev) => ({ ...prev, type: "groupForm" }))
              : () => ungroupObjects(groupedElements),
          },
        ]);
      } else {
        setObjectMenu([
          {
            name: "Group",
            handleClick: () =>
              setContextMenu((prev) => ({ ...prev, type: "groupForm" })),
          },
        ]);
      }
    } else if (selectedElements.length > 2) {
      setObjectMenu([
        {
          name: "Group",
          handleClick: () =>
            setContextMenu((prev) => ({ ...prev, type: "groupForm" })),
        },
      ]);
    } else {
      setObjectMenu([]);
    }
  }, [
    selectedElements,
    connectObjects,
    groupObjects,
    disconnectObjects,
    connections,
    resetContext,
    objects,
    ungroupObjects,
  ]);

  const handleContext = useCallback(
    (payload) => {
      if (payload.type === "mainContextMenu" && !emptySpace) return;
      payload.e.preventDefault();
      const rect = document
        .querySelector("#mainContainer")
        .getBoundingClientRect();
      const scrollDiv = document.querySelector("#mainContainer");
      const contextX = payload.e.pageX - rect.left;
      const contextY = payload.e.pageY - rect.top + scrollDiv.scrollTop;
      setContextMenu((prev) => ({
        ...prev,
        active: true,
        type: payload.type,
        contextX,
        contextY,
      }));
    },
    [emptySpace]
  );

  const rootCall = useCallback(
    async (call, payload) => {
      console.log("root call. ", call, payload);
      switch (call) {
        case "context":
          handleContext(payload);
          break;
        case "resetContext":
          resetContext();
          break;
        case "objectIn":
          setEmptySpace(false);
          break;
        case "objectOut":
          setEmptySpace(true);
          break;
        case "edit":
          return updateObject(payload.id, payload.payload);

        // case "updateLocation":
        // return updateObject(payload.id, payload.payload);

        case "updateSize":
          return updateObject(payload.id, payload.payload);

        case "group":
          return groupObjects(payload);

        case "ungroup":
          return updateObject(payload.id, payload.payload);

        case "addTogroup":
          return updateObject(payload.id, payload.payload);

        case "removeFromgroup":
          return updateObject(payload.id, payload.payload);

        default:
          break;
      }
    },
    [handleContext, resetContext, updateObject, groupObjects]
  );
  return (
    <Window
      // title={window.data.fileName}
      window={window}
      icon="diagram-tree"
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onRestore}
      onTypeChange={onTypeChange}
      collapseState={collapseState}
      title={window.data?.metaDataLevel2.name}
    >
      <FlowChart
        objects={objects}
        groups={groups}
        connections={connections}
        tempConnections={tempConnections}
        rootCall={rootCall}
        // onNetworkChange={onNetworkChange}
        dataObjectId={window.data.id}
        selectedElements={selectedElements}
        setSelectedElements={setSelectedElements}
        globalViewIndex={globalViewIndex}
        views={views}
        setGroups={setGroups}
      />
      {/* {contextMenu.active && ( */}
      <FloatingContext
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      >
        {contextMenu.type === "contextMenu" && (
          <ContextMenuComponent menu={objectMenu} />
        )}
        {contextMenu.type === "mainContextMenu" && (
          <ContextMenuComponent
            menu={views.map((view, index) => ({
              name: view[0].toLocaleUpperCase() + view.slice(1, view.length),
              handleClick: () => setGlobalViewIndex(index),
            }))}
          />
        )}
        {contextMenu.type === "groupForm" && (
          <GroupFrom rootCall={rootCall} groupObjects={groupObjects} />
        )}
      </FloatingContext>
      {/* )} */}
    </Window>
  );
});
