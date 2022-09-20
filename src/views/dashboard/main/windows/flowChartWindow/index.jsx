import { Intent, Spinner, Switch } from "@blueprintjs/core";
import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Bpmn } from "../../../../../components/bpmn";
import {
  addNewElementsConnection,
  getDataObjectConnections,
  getDataObject,
  removeNewElementsConnection,
} from "../../../../../services";
import { platformState } from "../../../../../store/portfolios";
import { elementSelectorState } from "../../../../../store/elementSelector";
import { showDangerToaster } from "../../../../../utils/toaster";
import { Window } from "../window";
import { FlowChart } from "../../../../../components/FlowChart";
import { FloatingContext } from "../../../../../components/FlowChart/context/floatingContext";
import { ContextMenuComponent } from "../../../../../components/FlowChart/context/contextMenuComponent";
export const FlowChartWindow = ({
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

  /* 
  // console.log("pn",preparedNodes);
  const getEdges = useCallback(async () => {
    const response = await getDataObjectConnections();
    setEdges(response.data.data.map(edge=>({from:edge.sourceId,to:edge.targetId})));
    // console.log(response.data.data);
  },[]);

  const getNodes = useCallback(async () => {
    const response = await getDataObject(window.data.id);
    setRefGroupData(response.data.data);
    // console.log(response.data.data);
  },[window.data.id]);

  useEffect(()=>{
    console.log("rfd",refGroupData)
    if(refGroupData){
      setPreparedNodes(refGroupData.dataObjectLevels.map((level) => {
        return level.dataObjectElements.map((element) => {
          return {
            label: element.label,
            name: element.name,
            description: element.description,
            id: element.id,
            x:element.x,
            y:element.y,
            width:element.width,
            height:element.height,
            rank:element.rank,
            color:element.color,
            type:element.Type,
            scalar:element.Scalar,
            level_value: level.level_value,
            level_name: level.name,
            level_id: level.id,
            level:element.level,
            connections:element.dataObjectConnections
          };
        });
      }))
    }
  },[refGroupData])

  useEffect(()=>{console.log("preparedNodes",preparedNodes)},[preparedNodes])

  useEffect(() => {
    getEdges();
    getNodes();
  }, [getEdges,getNodes]);
  // console.log(preparedNodes);
  const onNetworkChange = useCallback(async (data) => {
    const { sourceId, targetId, option } = data;
    if (!sourceId || !targetId) {
      // console.log(data);
      return;
    }
    //if(edges.length===0)return;

    const response = await addNewElementsConnection(data);
    console.log("working on network", data);
  },[]);
*/
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
      const response = await addNewElementsConnection({ sourceId, targetId });
      if (response.status >= 200 && response.status < 300) {
        setConnections((prev) => [...prev, response.data.data]);
        setSelectedElements([]);
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

  const groupObjects = useCallback(async () => {}, []);

  const ungroupObjects = useCallback(async () => {}, []);

  const addToGroup = useCallback(async () => {}, []);

  const removeFromGroup = useCallback(async () => {}, []);

  const updateObject = useCallback(async () => {}, []);

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

        // let singularityCheck = false;
        // selectedElements.forEach(element=>)
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
              ? () =>
                  groupObjects(selectedElements.map((element) => element.id))
              : () => ungroupObjects(groupedElements),
          },
        ]);
      } else {
        setObjectMenu([
          {
            name: "Group",
            handleClick: () =>
              groupObjects(selectedElements.map((element) => element.id)),
          },
        ]);
      }
    } else if (selectedElements.length > 2) {
      setObjectMenu([
        {
          name: "Group",
          handleClick: () =>
            groupObjects(selectedElements.map((element) => element.id)),
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

        default:
          break;
      }
    },
    [handleContext, resetContext]
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
        rootCall={rootCall}
        // onNetworkChange={onNetworkChange}
        dataObjectId={window.data.id}
        selectedElements={selectedElements}
        setSelectedElements={setSelectedElements}
        globalViewIndex={globalViewIndex}
        views={views}
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
              name: view[0].toLocaleUpperCase()+view.slice(1,view.length),
              handleClick: () => setGlobalViewIndex(index),
            }))}
          />
        )}
      </FloatingContext>
      {/* )} */}
    </Window>
  );
};
