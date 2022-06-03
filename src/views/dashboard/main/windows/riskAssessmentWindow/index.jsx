import {
  Intent,
  Spinner,
  Switch,
  Icon,
  Menu,
  MenuDivider,
  Classes,
  MenuItem,
  H5,
  FormGroup,
  InputGroup,
  Button,
  HTMLSelect,
  TextArea,
  FileInput,
} from "@blueprintjs/core";
// import { Classes } from '@blueprintjs/popover2'
import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  getRiskAssessment,
  addRiskObjectProperties,
  addRiskConnection,
  addRiskAssessmentGroup,
  addNewRiskObject,
  addRiskTemplate,
  getTemplates,
  addGroupFromTemplate,
  updateRiskObjectPosition,
  updateRiskObject,
  getRiskObject,
  deleteRiskConnection,
  getGroups,
  importGroup,
  updateRiskAssessmentGroup,
  getNewDataObjects,
  addNewDataObjectInstance,
  addInstanceConnection,
  addInstanceObjectConnection,
  updateNewDataObjectInstance
} from "../../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
} from "../../../../../utils/toaster";
import { objectSelectorState } from "../../../../../store/objectSelector";
import { Window } from "../window";
import { RiskAssessment } from "../../../../../components/riskAssessment";
import { show } from "@blueprintjs/core/lib/esm/components/context-menu/contextMenu";
export const RiskAssessmentWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [hoveredElement, setHoveredElement] = useState(null);
  const [firstContext, setFirstContext] = useState("main");
  const [elementEnable, setElementEnable] = useState(true);
  const [groupName, setGroupName] = useState(null);
  const [groupNameError, setGroupNameError] = useState(null);
  const [templateName, setTemplateName] = useState(null);
  const [templateNameError, setTemplateNameError] = useState(null);
  const [linkName, setLinkName] = useState(null);
  const [linkNameError, setLinkNameError] = useState(null);
  const [objectType, setObjectType] = useState(null);
  const [objectNameError, setObjectNameError] = useState(null);
  const [objectDescription, setObjectDescription] = useState(null);
  const [objectDescriptionError, setObjectDescriptionError] = useState(null);
  const [objectName, setObjectName] = useState(null);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [dataObjectInstances, setDataObjectInstances] = useState([]);
  const [selectedObjects, setSelectedObjects] =
    useRecoilState(objectSelectorState);
  const [contextMenu, setContextMenu] = useState({
    active: false,
    type: "",
    x: 0,
    y: 0,
    contextX: 0,
    contextY: 0,
    element: null,
  });
  const [globalGroups, setGlobalGroups] = useState([]);
  const [globalDataObjects, setGlobalDataObjects] = useState([]);
  const [editElement, setEditElement] = useState(null);
  const [riskObjects, setRiskObjects] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [connections, setConnections] = useState([]);
  const [instanceConnections, setInstanceConnections] = useState([]);
  const [instanceObjectConnections, setInstanceObjectConnections] = useState(
    []
  );
  const [groups, setGroups] = useState([]);
  const [importGroupId, setImportGroupId] = useState(null);
  const [importObjectId, setImportObjectId] = useState(null);
  const [importObject, setImportObject] = useState(null);
  const [importObjectText, setImportObjectText] = useState(null);
  const [importObjectFile, setImportObjectFile] = useState(null);
  const [url, setURL] = useState(null);
  const [importTemplateId, setImportTemplateId] = useState(null);
  const [importTemplateName, setImportTemplateName] = useState(null);
  const [importTemplateNameError, setImportTemplateNameError] = useState(null);
  const [importTemplateIdError, setImportTemplateIdError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [closedFace, setClosedFace] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await getTemplates();
      if (response.status === 201) {
        setTemplates(response.data.data);
      } else {
        showDangerToaster(`Error Fetching Templates`);
      }
    } catch (error) {
      showDangerToaster(`Error Fetching Templates ${error}`);
    }
  }, []);

  const getGlobalGroups = useCallback(async () => {
    const response = await getGroups();
    if (response.status === 201) {
      setGlobalGroups(
        response.data.data
          .filter((group) => group.shared)
          .map((group) => ({ id: group.id, name: group.name }))
      );
    } else {
      showDangerToaster(`Error Retrieving Global Groups Data`);
    }
  }, []);

  const riskAssessmentData = useCallback(async () => {
    const response = await getRiskAssessment(window.data.id);
    if (response.status === 200) {
      console.log(response.data.data);
      setRiskObjects(response.data.data.riskObjects);
      setDataObjectInstances(response.data.data.dataObjectsNewProperties);
      setMetaData(response.data.data.metaData.referenceGroupJsons[0].json);
      setGroups(response.data.data.riskGroups);
      setConnections(
        response.data.data.riskConnections.filter(
          (connection) => connection.status !== "deleted"
        )
      );
      setInstanceConnections(response.data.data.dataObjectsConnections);
      setInstanceObjectConnections(
        response.data.data.dataObjectsRiskObjectsConnections
      );
    } else {
      showDangerToaster(`Error Retrieving Risk Assessment Data`);
    }
    getGlobalGroups();
  }, [window.data.id, getGlobalGroups]);

  const contextMenuAction = useCallback(
    async (path) => {
      try {
        setContextMenu((prev) => ({ ...prev, type: "loading" }));
        const response = await addRiskObjectProperties(contextMenu.element, {
          dataObjectElements: path,
        });
        if (response.status === 200) {
          setContextMenu({
            active: false,
            type: "",
            x: 0,
            y: 0,
            contextX: 0,
            contextY: 0,
            element: null,
          });
        } else {
          setContextMenu({
            active: false,
            type: "",
            x: 0,
            y: 0,
            contextX: 0,
            contextY: 0,
            element: null,
          });
        }
        showSuccessToaster(
          `Successfully Added Properties to Risk Object ${contextMenu.element}`
        );
      } catch (er) {
        showDangerToaster(
          `Failed Adding Properties to Risk Object ${contextMenu.element}`
        );
        showDangerToaster(er);
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          contextX: 0,
          contextY: 0,
          element: null,
        });
      }
    },
    [contextMenu.element]
  );

  const handleConnection = useCallback(
    async (data) => {
      if (data.type === "connect") {
        if (
          selectedElements[0].type !== "instance" &&
          selectedElements[1].type !== "instance"
        ) {
          // console.log("risks");
          let payload = {
            sourceRef: selectedElements[0].id,
            targetRef: selectedElements[1].id,
            riskAssessmentId: window.data.id,
            name: linkName,
          };

          const response = await addRiskConnection(payload);
          setConnections((prev) => [...prev, response.data.data]);
          setSelectedElements([]);
          setSelectedObjects([]);
          console.log(payload);
        } else if (
          selectedElements[0].type === "instance" &&
          selectedElements[1].type === "instance"
        ) {
          let payload = {
            sourceRef: selectedElements[0].id,
            targetRef: selectedElements[1].id,
            riskAssessmentId: window.data.id,
            name: linkName,
          };

          const response = await addInstanceConnection(payload);
          setInstanceConnections((prev) => [...prev, response.data.data]);
          setSelectedElements([]);
          setSelectedObjects([]);
          console.log(payload);
        } else {
          let instance, object, source, target;
          if (selectedElements[0].type === "instance") {
            instance = selectedElements[0];
            object = selectedElements[1];
          } else {
            instance = selectedElements[1];
            object = selectedElements[0];
          }
          // console.log(instance.dataObjectNew.IOtype,object);
          if (instance.dataObjectNew.IOtype === "Input") {
            source = instance;
            target = object;
          } else {
            target = instance;
            source = object;
          }

          let payload = {
            sourceRef: source.id,
            targetRef: target.id,
            riskAssessmentId: window.data.id,
            name: linkName,
            objectType:
              instance.dataObjectNew.IOtype === "Input" ? "Input" : "Output",
          };

          const response = await addInstanceObjectConnection(payload);
          setInstanceObjectConnections((prev) => [...prev, response.data.data]);
          setSelectedElements([]);
          setSelectedObjects([]);
          console.log(payload);
        }
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          contextX: 0,
          contextY: 0,
          element: null,
        });
      }
    },
    [
      window.data.id,
      selectedElements,
      setConnections,
      linkName,
      setSelectedObjects,
    ]
  );

  useEffect(() => {
    riskAssessmentData();
  }, [riskAssessmentData]);

  const getChildren = useCallback(
    (object) => {
      return object?.children.length > 0 ? (
        <MenuItem MenuItem text={object.name}>
          {object.children.map((subObject) => getChildren(subObject))}
        </MenuItem>
      ) : object.path ? (
        <MenuItem
          text={object.name}
          htmlTitle={object.description ? object.description : null}
          onClick={() => contextMenuAction(object.path)}
        />
      ) : (
        <MenuItem text={object.name} />
      );
    },
    [contextMenuAction]
  );

  const menu = metaData.map((l1) => {
    return (
      <MenuItem text={l1.name}>
        {l1.metaDataLevel2.map((l2) => {
          return (
            <MenuItem text={l2.name}>
              {l2.dataObjects[0]?.children
                ? l2.dataObjects[0].children.map((l1Do) => getChildren(l1Do))
                : null}
            </MenuItem>
          );
        })}
      </MenuItem>
    );
  });

  // console.log(menu);

  const handleContextMenu = useCallback(
    async (e, data) => {
      e.preventDefault();
      console.log(data, data["position.enabled"]);
      if (data && !data.from) {
        if (data["position.enabled"]) {
          setElementEnable(true);
        } else {
          setElementEnable(false);
        }
      }

      let type, id, element;
      const rect = document
        .querySelector("#mainContainer")
        .getBoundingClientRect();
      const scrollDiv = document.querySelector("#mainContainer");
      const contextX = e.pageX - rect.left;
      const contextY = e.pageY - rect.top + scrollDiv.scrollTop;
      let x = e.nativeEvent.layerX;
      let y = e.nativeEvent.layerY;
      if (data.from === "main" && firstContext === "main") {
        type = "create";
        // x = e.nativeEvent.layerX+ 20;
        // y = e.nativeEvent.layerY + 50;
      } else if (e.target.id.split("-").length === 2) {
        type = "template";
        setFirstContext("template");
        id = e.target.id.split("-")[1];
      } else {
        // if (e.target.id.split("-").length === 3){
        //   id = e.target.id.split("-")[3];
        // }
        if (selectedElements.length === 0) {
          type = "context";
          setFirstContext("context");
        } else if (selectedElements.length === 2) {
          type = "connection";
          setFirstContext("connection");
        } else if (selectedElements.length > 2) {
          type = "grouping";
          setFirstContext("grouping");
        } else {
          type = "object";
          setFirstContext("object");
        }
      }
      element = id
        ? Number(id)
        : Number(e.target.parentElement.id.split("-")[2]);

      console.log(type, e.target.parentElement.id, element);
      setContextMenu((prev) => ({
        active: true,
        type,
        x,
        y,
        contextX,
        contextY,
        element,
      }));
    },
    [setContextMenu, selectedElements, firstContext]
  );

  const addNewTemplate = useCallback(async () => {
    const payload = {
      riskGroupId: contextMenu.element,
      name: templateName,
    };

    const response = await addRiskTemplate(payload);
    setContextMenu({
      active: false,
      type: "",
      x: 0,
      y: 0,
      contextX: 0,
      contextY: 0,
      element: null,
    });
    setTimeout(riskAssessmentData, 100);
    // const redraw = await riskAssessmentData();
  }, [riskAssessmentData, contextMenu, templateName]);

  const handleGrouping = useCallback(
    async (data) => {
      if (data.type === "group") {
        const payload = {
          riskAssessmentId: window.data.id,
          riskObjects: selectedElements.filter(item=>item.type!=="instance").map((object) => object.id),
          dataObjects: selectedElements.filter(item=>item.type==="instance").map((object) => object.id),
          x: Number(contextMenu.x + 15),
          y: Number(contextMenu.y + 15),
          name: groupName,
        };
        console.log(payload);
        const response = await addRiskAssessmentGroup(payload);
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          contextX: 0,
          contextY: 0,
          element: null,
        });
        setSelectedElements([]);
        setSelectedObjects([]);
        setTimeout(riskAssessmentData, 500);
        // const redraw = await riskAssessmentData();
      }
    },
    [
      riskAssessmentData,
      window.data.id,
      selectedElements,
      contextMenu,
      groupName,
      setSelectedObjects,
    ]
  );

  const resetContext = useCallback(() => {
    setContextMenu({
      active: false,
      type: "",
      x: 0,
      y: 0,
      contextX: 0,
      contextY: 0,
      element: null,
    });
    setObjectName(null);
    setObjectDescription(null);
    setEditElement(null);
  }, []);

  const editRiskObject = useCallback(
    async (id, payload, groupId) => {
      console.log("main", payload);
      const response = await updateRiskObject(id, payload);
      if (response.status === 200) {
        riskAssessmentData();
      }
      return "Done";
    },
    [riskAssessmentData]
  );

  const addRiskObject = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsServiceLoading(true);
        const payload = editElement
          ? { name: objectName, description: objectDescription }
          : {
              type: objectType.toLowerCase(),
              name: objectName,
              description: objectDescription,
              x: contextMenu.x,
              y: contextMenu.y,
              riskAssessmentId: window.data.id,
              enabled: true,
            };

        if (editElement) {
          const response = await updateRiskObject(editElement, payload);
          riskAssessmentData();
        } else {
          const response = await addNewRiskObject(payload);
          if (response.status === 201) {
            const newObject = { ...response.data.data };
            newObject["position.x"] =
              response.data.data.riskObjectsPositions[0].x;
            newObject["position.y"] =
              response.data.data.riskObjectsPositions[0].y;
            newObject["position.enabled"] = true;
            setRiskObjects((prev) => [...prev, newObject]);
          }
        }

        setEditElement(null);
        setIsServiceLoading(false);
        resetContext();
        setObjectName(null);
        setObjectType(null);
        setObjectDescription(null);
      } catch (er) {
        setEditElement(null);
        setIsServiceLoading(false);
        showDangerToaster(`Unable to Create Risk Object ${er}`);
        resetContext();
        setObjectName(null);
        setObjectType(null);
        setObjectDescription(null);
      }
    },
    [
      editElement,
      contextMenu,
      window.data.id,
      objectName,
      objectType,
      resetContext,
      objectDescription,
      riskAssessmentData,
    ]
  );

  const createGroupFromTemplate = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const payload = {
          riskAssessmentId: window.data.id,
          riskTemplateId: importTemplateId,
          name: importTemplateName,
          x: contextMenu.x,
          y: contextMenu.y,
        };
        const response = await addGroupFromTemplate(payload);
        resetContext();
        setImportTemplateId(null);
        setImportTemplateIdError(null);
        setImportTemplateName(null);
        setImportTemplateNameError(null);
        riskAssessmentData();
      } catch (error) {}
    },
    [
      window.data.id,
      importTemplateId,
      importTemplateName,
      contextMenu,
      setImportTemplateId,
      setImportTemplateIdError,
      setImportTemplateName,
      setImportTemplateNameError,
      resetContext,
      riskAssessmentData,
    ]
  );

  const updateElementData = useCallback(async () => {
    setEditElement(contextMenu.element);
    const riskObject = await getRiskObject(contextMenu.element);
    if (riskObject.status === 200) {
      const { name, description } = riskObject.data.data;
      console.log(name, description);
      setObjectName(name);
      setObjectDescription(description);
      setContextMenu((prev) => ({ ...prev, type: "create object" }));
    }
    // const object =
  }, [contextMenu.element]);

  const handleObjectAction = useCallback(
    async (element) => {
      if (element.type === "risk") {
        const response =
          element.operation === "enable"
            ? await updateRiskObjectPosition(window.data.id, element.id, {
                enabled: element.payload,
              })
            : await updateRiskObject(element.id, { status: element.payload });

        setRiskObjects((prev) =>
          prev.map((object) => {
            if (object.id === element.id) {
              const updatedObject = { ...object };
              element.operation === "enable"
                ? (updatedObject["position.enabled"] = element.payload)
                : (updatedObject["status"] = element.payload);
              return updatedObject;
            } else {
              return object;
            }
          })
        );

        setGroups((prev) =>
          prev.map((group) => ({
            ...group,
            elements: group.elements.map((object) => {
              if (object.id === element.id) {
                const updatedObject = { ...object };
                element.operation === "enable"
                  ? (updatedObject["position.enabled"] = element.payload)
                  : (updatedObject["status"] = element.payload);
                return updatedObject;
              } else {
                return object;
              }
            }),
          }))
        );
      }else{
        const response =
          element.operation === "enable"
            ? await updateNewDataObjectInstance(element.id, {
                disable: element.payload,
              })
            : await updateNewDataObjectInstance(element.id, { status: element.payload });

            setDataObjectInstances((prev) =>
          prev.map((object) => {
            if (object.id === element.id) {
              const updatedObject = { ...object };
              element.operation === "enable"
                ? (updatedObject.disable = element.payload)
                : (updatedObject.status = element.payload);
              return updatedObject;
            } else {
              return object;
            }
          })
        );
      }
    },
    [window.data.id]
  );

  const updateElementStatus = useCallback(async () => {
    const response = await updateRiskObjectPosition(
      window.data.id,
      contextMenu.element,
      {
        enabled: !elementEnable,
      }
    );
    if (response.status === 200) {
      setRiskObjects((prev) =>
        prev.map((object) => {
          if (object.id === contextMenu.element) {
            const updatedObject = { ...object };
            updatedObject["position.enabled"] = !elementEnable;
            return updatedObject;
          } else {
            return object;
          }
        })
      );

      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          elements: group.elements.map((object) => {
            if (object.id === contextMenu.element) {
              const updatedObject = { ...object };
              updatedObject["position.enabled"] = !elementEnable;
              return updatedObject;
            } else {
              return object;
            }
          }),
        }))
      );
      resetContext();
    }
  }, [window.data.id, contextMenu.element, elementEnable, resetContext]);

  useEffect(() => {
    let connection;
    if (selectedElements.length === 2) {
      console.log(
        "selected",
        selectedElements[0].id,
        selectedElements[1].id,
        connections
      );
      const first = connections.find(
        (connection) =>
          connection.sourceRef === selectedElements[0].id &&
          connection.targetRef === selectedElements[1].id
      );
      console.log("first", first);
      if (first) {
        connection = first;
      } else {
        const second = connections.find(
          (connection) =>
            connection.sourceRef === selectedElements[1].id &&
            connection.targetRef === selectedElements[0].id
        );
        console.log("second", second);
        if (second) {
          connection = second;
        }
      }
      console.log("selected", connection);
      if (connection) {
        setSelectedConnection(connection.id);
      } else {
        setSelectedConnection(null);
      }
    } else {
      setSelectedConnection(null);
    }
  }, [selectedElements, connections]);

  const handleDisconnect = useCallback(async () => {
    const response = await deleteRiskConnection(selectedConnection);
    resetContext();
    setConnections((prev) =>
      prev.filter((connection) => connection.id !== selectedConnection)
    );
    setSelectedConnection(null);
  }, [selectedConnection, resetContext]);

  const importSharedGroup = useCallback(async () => {
    const payload = {
      riskAssessmentId: window.data.id,
      riskGroupId: importGroupId,
      x: contextMenu.x,
      y: contextMenu.y,
    };

    const response = await importGroup(payload);
    resetContext();
    setImportGroupId(null);
    riskAssessmentData();
  }, [
    contextMenu.x,
    contextMenu.y,
    importGroupId,
    window.data.id,
    resetContext,
    riskAssessmentData,
  ]);

  const handleShareGroup = useCallback(async () => {
    const response = await updateRiskAssessmentGroup(
      contextMenu.element,
      window.data.id,
      { shared: 1 }
    );

    if (response.status === 201) {
      showSuccessToaster(
        `Group #${contextMenu.element} is Shared Successfully`
      );
      resetContext();
      riskAssessmentData();
    } else {
      showDangerToaster(
        `Error Sharing Group #${contextMenu.element}: ${response.data.error}`
      );
    }
  }, [window.data.id, contextMenu.element, resetContext, riskAssessmentData]);

  const fetchDataObjects = useCallback(async () => {
    const response = await getNewDataObjects();
    if (response.status === 200) {
      setGlobalDataObjects(response.data.data);
    } else {
      showDangerToaster(`Faild to get the Data Objects`);
    }
  }, []);

  const importDataObject = useCallback(async () => {
    console.log(importObjectFile);
    let payload = new FormData();
    //  payload = {
    //   riskAssessmentId: window.data.id,
    //   dataObjectNewId: importObjectId,
    //   x: contextMenu.x,
    //   y: contextMenu.y,
    //   textType: importObjectText,
    //   // fileCSV:importObjectFile
    // };
    payload.append("riskAssessmentId", window.data.id);
    payload.append("dataObjectNewId", importObjectId);
    payload.append("x", contextMenu.x);
    payload.append("y", contextMenu.y);
    payload.append("textType", importObjectText);
    payload.append("url", url);
    payload.append("fileCSV", importObjectFile);

    const response = await addNewDataObjectInstance(payload);
    if (response.status === 200) {
      resetContext();
      setImportObjectId(null);
      setImportObject(null);
      setImportObjectText(null);
      setImportObjectFile(null);
      riskAssessmentData();
    }
  }, [
    contextMenu.x,
    contextMenu.y,
    importObjectId,
    importObjectText,
    importObjectFile,
    url,
    window.data.id,
    resetContext,
    riskAssessmentData,
  ]);

  return (
    <>
      <Window
        // title={window.data.fileName}
        window={window}
        icon="diagram-tree"
        onClose={onClose}
        onCollapse={onCollapse}
        onRestore={onRestore}
        onTypeChange={onTypeChange}
        collapseState={collapseState}
        title={window.data.name}
      >
        {contextMenu.active && contextMenu.type === "loading...." && (
          <div
            key="text"
            style={{
              zIndex: 10000000000,
              position: "absolute",
              backgroundColor: "#30404D",
              color: "white",
              top: "25%",
              left: "25%",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>Add Physical Object Properties</H5>
          </div>
        )}
        <RiskAssessment
          objects={riskObjects}
          groups={groups}
          metaData={metaData}
          dataObjectInstances={dataObjectInstances}
          riskAssessmentId={window.data.id}
          handleContextMenu={handleContextMenu}
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          connections={connections}
          instanceConnections={instanceConnections}
          instanceObjectConnections={instanceObjectConnections}
          resetContext={resetContext}
          setFirstContext={setFirstContext}
          editRiskObject={editRiskObject}
          closedFace={closedFace}
          setHoveredElement={setHoveredElement}
          handleObjectAction={handleObjectAction}
          // onContext={handleRiskViewContext}
        />
      </Window>
      <div
        className=""
        style={{
          zIndex: 10000000000,
          fontSize: "10px",
          position: "absolute",
          top: contextMenu.contextY,
          left: contextMenu.contextX,
        }}
      >
        {contextMenu.active && contextMenu.type === "context" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            {elementEnable ? menu : null}

            <MenuDivider />
            <MenuItem text="Edit" onClick={updateElementData} />
            {elementEnable ? (
              <>
                <MenuItem text="Disable" onClick={updateElementStatus} />
              </>
            ) : (
              <MenuItem text="Enable" onClick={updateElementStatus} />
            )}
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "connection" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              disabled={selectedConnection ? true : false}
              text="Connect"
              onClick={() => {
                setContextMenu((prev) => ({
                  ...prev,
                  type: "connection name",
                }));
              }}
            />
            <MenuItem
              onClick={handleDisconnect}
              disabled={selectedConnection ? false : true}
              text="Disconnect"
            />
            <MenuDivider />
            <MenuItem
              text="Group"
              onClick={() => {
                setContextMenu((prev) => ({ ...prev, type: "group name" }));
              }}
            />
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "grouping" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Group"
              onClick={() => {
                setContextMenu((prev) => ({
                  ...prev,
                  type: "group name",
                }));
              }}
            />
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "template" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Create Template"
              onClick={() => {
                setContextMenu((prev) => ({
                  ...prev,
                  type: "create template",
                }));
              }}
            />

            <MenuItem text="Share Group" onClick={handleShareGroup} />
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "create" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Create Virtual Risk Object"
              onClick={() => {
                setObjectType("Virtual");
                setContextMenu((prev) => ({
                  ...prev,
                  type: "create object",
                }));
              }}
            />
            <MenuItem
              text="Create Model Risk Object"
              onClick={() => {
                setObjectType("Model");
                setContextMenu((prev) => ({
                  ...prev,
                  type: "create object",
                }));
              }}
            />
            <MenuDivider />
            <MenuItem
              text="Import Template"
              onClick={() => {
                fetchTemplates();
                setContextMenu((prev) => ({
                  ...prev,
                  type: "import template",
                }));
              }}
            />
            <MenuItem
              text="Import Shared Group"
              onClick={() => {
                fetchTemplates();
                setContextMenu((prev) => ({
                  ...prev,
                  type: "import group",
                }));
              }}
            />
            <MenuItem
              text="Import Data Object"
              onClick={() => {
                fetchDataObjects();
                setContextMenu((prev) => ({
                  ...prev,
                  type: "import data object",
                }));
              }}
            />
            <MenuDivider />
            <MenuItem
              text={closedFace ? "Show Open Faces" : "Show Closed Faces"}
              onClick={() => {
                setClosedFace((prev) => !prev);
                setContextMenu((prev) => ({
                  ...prev,
                  type: null,
                }));
              }}
            />
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "group name" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>New Group Name</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGrouping({ type: "group" });
              }}
            >
              <FormGroup
                label="Name"
                labelInfo="(required)"
                intent={groupNameError ? Intent.DANGER : Intent.NONE}
                helperText={groupNameError}
                labelFor="newGroupName"
              >
                <InputGroup
                  required
                  id="newGroupName"
                  onChange={(event) => {
                    setGroupNameError(null);
                    setGroupName(event.target.value);
                  }}
                />
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setGroupNameError(null);
                    setGroupName(null);
                    resetContext();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        )}

        {contextMenu.active && contextMenu.type === "create template" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>New Template Name</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNewTemplate();
              }}
            >
              <FormGroup
                label="Name"
                labelInfo="(required)"
                intent={templateNameError ? Intent.DANGER : Intent.NONE}
                helperText={templateNameError}
                labelFor="newTemplateName"
              >
                <InputGroup
                  required
                  id="newTemplateName"
                  onChange={(event) => {
                    setTemplateNameError(null);
                    setTemplateName(event.target.value);
                  }}
                />
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setTemplateNameError(null);
                    setTemplateName(null);
                    resetContext();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* {contextMenu.active && contextMenu.type === "create" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem disabled text="Create Virtual Risk Object" />
            <MenuItem disabled text="Create Model Risk Object" />
          </Menu>
        )} */}

        {contextMenu.active && contextMenu.type === "connection name" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>New Connection Name</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConnection({ type: "connect" });
              }}
            >
              <FormGroup
                label="Name"
                labelInfo="(required)"
                intent={linkNameError ? Intent.DANGER : Intent.NONE}
                helperText={linkNameError}
                labelFor="newLinkName"
              >
                <InputGroup
                  required
                  id="newLinkName"
                  onChange={(event) => {
                    setLinkNameError(null);
                    setLinkName(null);
                    setLinkName(event.target.value);
                  }}
                />
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setLinkNameError(null);
                    setLinkName(null);
                    resetContext();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        )}

        {contextMenu.active && contextMenu.type === "create object" && (
          <div
            key="text"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>
              {editElement
                ? `Edit Element ${editElement}`
                : `Add New ${objectType} Object`}
            </H5>
            <form onSubmit={addRiskObject}>
              <FormGroup
                label="Name"
                labelInfo="(required)"
                intent={objectNameError ? Intent.DANGER : Intent.NONE}
                helperText={objectNameError}
                labelFor="newObjectName"
              >
                <InputGroup
                  required
                  id="newObjectName"
                  value={objectName}
                  onChange={(event) => {
                    setObjectNameError(null);
                    setObjectName(event.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Description"
                labelInfo="(required)"
                intent={objectDescriptionError ? Intent.DANGER : Intent.NONE}
                helperText={objectDescriptionError}
                labelFor="newObjectDescription"
              >
                <TextArea
                  required
                  value={objectDescription}
                  id="newObjectDescription"
                  onChange={(event) => {
                    setObjectDescriptionError(null);
                    setObjectDescription(event.target.value);
                  }}
                />
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    resetContext();
                    setObjectName(null);
                    setObjectNameError(null);
                    setObjectType(null);
                    setObjectDescriptionError(null);
                    setObjectDescription(null);
                    setEditElement(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                  // onClick={addPortfolio}
                >
                  {editElement ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {contextMenu.active && contextMenu.type === "import template" && (
          <div
            key="text"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>Import Group Template</H5>
            <form onSubmit={createGroupFromTemplate}>
              <FormGroup
                label="Name"
                labelInfo="(required)"
                intent={importTemplateNameError ? Intent.DANGER : Intent.NONE}
                helperText={importTemplateNameError}
                labelFor="importTemplateName"
              >
                <InputGroup
                  required
                  id="importTemplateName"
                  onChange={(event) => {
                    setImportTemplateNameError(null);
                    setImportTemplateName(event.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Template"
                labelInfo="(required)"
                intent={false ? Intent.DANGER : Intent.NONE}
                // helperText="Error"
                labelFor="Template"
              >
                <HTMLSelect
                  onChange={(e) => setImportTemplateId(Number(e.target.value))}
                >
                  <option selected disabled>
                    Select Template
                  </option>
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <option value={template.id}>{template.name}</option>
                    ))
                  ) : (
                    <option>No Templates Avilable</option>
                  )}
                </HTMLSelect>
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    resetContext();
                    setImportTemplateNameError(null);
                    setImportTemplateName(null);
                    setImportTemplateId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                  // onClick={addPortfolio}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        )}

        {contextMenu.active && contextMenu.type === "import group" && (
          <div
            key="text"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>Import Shared Group</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                importSharedGroup();
              }}
            >
              <FormGroup
                label="Group"
                labelInfo="(required)"
                intent={false ? Intent.DANGER : Intent.NONE}
                // helperText="Error"
                labelFor="Group"
              >
                <HTMLSelect
                  onChange={(e) => setImportGroupId(Number(e.target.value))}
                >
                  <option selected disabled>
                    Select Group
                  </option>
                  {globalGroups.length > 0 ? (
                    globalGroups.map((group) => (
                      <option value={group.id}>{group.name}</option>
                    ))
                  ) : (
                    <option>No Groups are Avilable</option>
                  )}
                </HTMLSelect>
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    resetContext();
                    setImportGroupId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                  // onClick={addPortfolio}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        )}
        {contextMenu.active && contextMenu.type === "import data object" && (
          <div
            key="text"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>Import Data Object</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                importDataObject();
              }}
            >
              <FormGroup
                label="Object"
                labelInfo="(required)"
                intent={false ? Intent.DANGER : Intent.NONE}
                // helperText="Error"
                labelFor="Object"
              >
                <HTMLSelect
                  onChange={(e) => {
                    setImportObjectId(Number(e.target.value));
                    setImportObject(
                      globalDataObjects.find(
                        (object) => object.id === Number(e.target.value)
                      )
                    );
                  }}
                >
                  <option selected disabled>
                    Select Object
                  </option>
                  {globalDataObjects.length > 0 ? (
                    globalDataObjects.map((object) => (
                      <option value={object.id}>{object.name}</option>
                    ))
                  ) : (
                    <option>No Data Objects are Avilable</option>
                  )}
                </HTMLSelect>
              </FormGroup>
              {importObject?.arrayName ? null : (
                <>
                  <FormGroup
                    label="Text"
                    labelInfo="(required)"
                    labelFor="texttype"
                  >
                    <TextArea
                      // required
                      value={importObjectText}
                      fill={true}
                      id="texttype"
                      onChange={(event) => {
                        setImportObjectText(event.target.value);
                      }}
                    />
                  </FormGroup>
                  <FormGroup
                    label={`Attachment`}
                    labelInfo="(required)"
                    intent={false ? Intent.DANGER : Intent.NONE}
                    labelFor="Type"
                  >
                    <FileInput
                      fill={true}
                      hasSelection={importObjectFile}
                      text={
                        importObjectFile?.name
                          ? importObjectFile?.name
                          : "Choose file..."
                      }
                      onInputChange={(e) => {
                        console.log(e);
                        setImportObjectFile(e.target.files[0]);
                      }}
                    ></FileInput>
                  </FormGroup>
                  <FormGroup
                    label="URL"
                    // labelInfo="(required)"
                    labelFor="newObjectURL"
                  >
                    <InputGroup
                      // required
                      id="newObjectURL"
                      value={url}
                      onChange={(event) => {
                        setURL(event.target.value);
                      }}
                    />
                  </FormGroup>
                </>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  disabled={isServiceLoading}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    resetContext();
                    setImportObjectId(null);
                    setImportObjectText(null);
                    setImportObjectFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isServiceLoading}
                  intent={Intent.SUCCESS}
                  // onClick={addPortfolio}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
