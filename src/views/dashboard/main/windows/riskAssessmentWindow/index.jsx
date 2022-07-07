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
  Checkbox,
} from "@blueprintjs/core";
// import { Classes } from '@blueprintjs/popover2'
import { useCallback, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
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
  updateNewDataObjectInstance,
  editGroup,
  deleteInstanceRiskConnection,
  deleteInstanceConnection,
  getRiskAssessmentViews,
  addRiskAssessmentView,
  updateRiskAssessmentView,
} from "../../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
} from "../../../../../utils/toaster";
import { objectSelectorState } from "../../../../../store/objectSelector";
import { Window } from "../window";
import { RiskAssessment } from "../../../../../components/riskAssessment";
import { show } from "@blueprintjs/core/lib/esm/components/context-menu/contextMenu";
import { set } from "lodash";
import { data } from "vis-network";
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
  const [activeObject, setActiveObject] = useState(null);
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
  const [newViewName, setNewViewName] = useState("");
  const [viewsList, setViewsList] = useState([]);
  const [filter, setFilter] = useState({
    normal: false,
    everything: false,
    connections: true,
    riskObjects: false,
    pObjects: true,
    mObjects: true,
    vObjects: true,
    dataObjects: false,
    iDataObjects: true,
    oDataObjects: true,
    groups: true,
    collapsedGroups: false,
    expandedGroups: false,
    deleted: false,
    invisible: false,
    disabled: true,
  });

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

  const checkObject = useCallback(
    (id, type) => {
      let object;
      let group = null;
      if (type === "risk") {
        object = riskObjects.find((obj) => obj?.id === id);
      } else {
        object = dataObjectInstances.find((obj) => obj?.id === id);
      }
      if (!object) {
        groups.forEach((grp) => {
          if (!object) {
            if (type === "risk") {
              object = grp.elements.find((obj) => obj?.id === id);
            } else {
              object = grp.dataObjects.find((obj) => obj?.id === id);
            }
          }

          if (object) {
            group = grp;
            //  console.log("grp-obj",object, grp,id, type);
            console.log("obj", object, Date.now());
            // return { object:object, group: grp };
          }
        });
      }
      return { object, group };
    },
    [riskObjects, dataObjectInstances, groups]
  );

  const checkFilter = useCallback(
    (type, status, disabled) => {
      let check = false;

      if (status === "delete") return false;

      if (filter.everything) return true;

      if (filter.normal) {
        check = status !== "invisible" ? true : false;
      } else {
        if (disabled) {
          if (!filter.disabled && !filter.everything) {
            return false;
          } else {
            check = true;
          }
        }

        if (type === "group") {
          if (!filter.groups && !filter.everything) {
            return false;
          } else {
            return true;
          }
        }

        // if (status === "deleted") return false;
        check = filter.connections && type === "connection" ? true : check;
        check = filter.vObjects && type === "virtual" ? true : check;
        check = filter.pObjects && type === "physical" ? true : check;
        check = filter.mObjects && type === "model" ? true : check;
        check =
          filter.riskObjects &&
          (type === "virtual" || type === "physical" || type === "model")
            ? true
            : check;
        check = filter.oDataObjects && type === "Output" ? true : check;
        check = filter.iDataObjects && type === "Input" ? true : check;
        check =
          filter.dataObjects && (type === "Input" || type === "Output")
            ? true
            : check;
        // check =
        // (filter.deleted && status === "deleted") ||
        //   (filter.invisible && status === "invisible")
        // (filter.disabled && disabled) ||
        // (filter.expandedGroups && status === "expanded") ||
        // (filter.collapsedGroups && status === "collapsed")
        //     ? true
        //     : false;
      }
      // console.log(type, status, filter, check);
      return check;
    },
    [filter]
  );

  const checkConnctionVisibility = useCallback(
    (connection, type) => {
      let check = false;
      let target, source;

      if (connection.status === "delete") return false;
      if (!filter.everything && !filter.normal && !filter.connections)
        return false;

      switch (type) {
        case "riskObjects":
          target = checkObject(connection.sourceRef, "risk");
          source = checkObject(connection.targetRef, "risk");

          console.log("con", connection.sourceRef, source, Date.now());
          check =
            checkFilter(
              target.object?.type,
              target.object?.status,
              !target.object["position.enabled"]
            ) &&
            checkFilter(
              source.object?.type,
              source.object?.status,
              !source.object["position.enabled"]
            );

          if (!check) return false;

          if (target.group) {
            check =
              target.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : false;
          }

          if (source.group) {
            check =
              source.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : false;
          }

          console.log(target, source);
          break;

        case "dataObjects":
          target = checkObject(connection.sourceRef, "instance");
          source = checkObject(connection.targetRef, "instance");
          // console.log(
          //   "-------",
          //   target.object.id,
          //   target.object.status,
          //   checkFilter(target.object.dataObjectNew.IOtype, target.object.status),
          //   source.object.id,
          //   source.object.status,
          //   checkFilter(source.object.dataObjectNew.IOtype, source.object.status)
          // );
          check =
            checkFilter(
              target.object?.dataObjectNew.IOtype,
              target.object?.status,
              target.object?.disable
            ) &&
            checkFilter(
              source.object?.dataObjectNew.IOtype,
              source.object?.status,
              source.object?.disable
            );
          // console.log(check);
          if (!check) return false;

          if (target.group) {
            check =
              target.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : false;
          }

          if (source.group) {
            check =
              source.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : false;
          }
          break;

        case "riskDataObjects":
          if (connection.objectType === "Output") {
            source = checkObject(connection.sourceRef, "risk");
            target = checkObject(connection.targetRef, "instance");
            check =
              checkFilter(
                source.object?.type,
                source.object?.status,
                !source.object["position.enabled"]
              ) &&
              checkFilter(
                target.object?.dataObjectNew.IOtype,
                target.object?.status,
                target.object?.disable
              );
          } else {
            source = checkObject(connection.sourceRef, "instance");
            target = checkObject(connection.targetRef, "risk");
            check =
              checkFilter(
                source.object?.dataObjectNew.IOtype,
                source.object?.status,
                source.object?.disable
              ) &&
              checkFilter(
                target.object?.type,
                target.object?.status,
                !target.object["position.enabled"]
              );
          }
          if (!check) return false;

          if (target.group) {
            check =
              target.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : false;
          }

          if (source.group) {
            check =
              source.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : false;
          }
          break;

        default:
          break;
      }
      // console.log("check", check, connection,target,source);
      return check;
    },
    [
      checkFilter,
      checkObject,
      filter.connections,
      filter.everything,
      filter.normal,
      filter.groups,
    ]
  );

  const updateViewsList = useCallback(async () => {
    try {
      const response = await getRiskAssessmentViews(window.data.id);
      if (response.status >= 200 && response.status < 300) {
        setViewsList(response.data.data);
        const current = response.data.data.find((view) => view.current);
        if (current) {
          setFilter(current.filter);
        }
      } else {
        showDangerToaster(`Couldn't get views`);
      }
    } catch (error) {
      showDangerToaster(`Couldn't get views: ${error}`);
    }
  }, [window.data.id]);

  const changeView = useCallback(
    async (id) => {
      // console.log(viewsList);
      const response = await updateRiskAssessmentView(id, { current: true });
      updateViewsList();
      setFilter(viewsList.find((view) => view.id === id).filter);
    },
    [viewsList, updateViewsList]
  );

  const postView = useCallback(async () => {
    setIsServiceLoading(true);
    try {
      const response = await addRiskAssessmentView({
        name: newViewName,
        filter,
        riskAssessmentId: window.data.id,
        current: true,
      });

      if (response.status >= 200 && response.status < 300) {
        updateViewsList();
        resetContext();
      } else {
        showDangerToaster(`Couldn't add view`);
      }
    } catch (error) {
      showDangerToaster(`Couldn't add view: ${error}`);
    }
    setIsServiceLoading(false);
  }, [newViewName, filter, window.data.id, updateViewsList, resetContext]);

  const removeObjectConnections = useCallback((obj) => {
    // console.log("remove connection", obj.type);
    if (obj.type !== "instance") {
      setConnections((prev) =>
        prev.filter(
          (connection) =>
            connection.sourceRef !== obj.id && connection.targetRef !== obj.id
        )
      );
      setInstanceObjectConnections((prev) =>
        prev.filter(
          (connection) =>
            (connection.sourceRef !== obj.id &&
              connection.objectType === "Output") ||
            (connection.targetRef !== obj.id &&
              connection.objectType === "Input")
        )
      );
    } else {
      setInstanceConnections((prev) =>
        prev.filter(
          (connection) =>
            connection.sourceRef !== obj.id && connection.targetRef !== obj.id
        )
      );
      setInstanceObjectConnections((prev) =>
        prev.filter(
          (connection) =>
            (connection.sourceRef !== obj.id &&
              connection.objectType === "Input") ||
            (connection.targetRef !== obj.id &&
              connection.objectType === "Output")
        )
      );
    }
  }, []);

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
    try {
      const response = await getRiskAssessment(window.data.id);
      if (response.status === 200) {
        // console.log(response.data.data);
        setRiskObjects(response.data.data.riskObjects);
        setDataObjectInstances(response.data.data.dataObjectsNewProperties);
        setMetaData(response.data.data.metaData.referenceGroupJsons[0].json);
        setGroups(response.data.data.riskGroups);
        setConnections(
          response.data.data.riskConnections
          // .filter(
          //   (connection) =>
          //     connection.status !== "deleted" &&
          //     connection.status !== "invisible"
          // )
        );
        setInstanceConnections(
          response.data.data.dataObjectsConnections
          // .filter(
          //   (connection) =>
          //     connection.status !== "deleted" &&
          //     connection.status !== "invisible"
          // )
        );
        setInstanceObjectConnections(
          response.data.data.dataObjectsRiskObjectsConnections
          // .filter(
          //   (connection) =>
          //     connection.status !== "deleted" &&
          //     connection.status !== "invisible"
          // )
        );
        getGlobalGroups();
        updateViewsList();
        // getDeleted();
      } else {
        showDangerToaster(`Error Retrieving Risk Assessment Data`);
        setTimeout(riskAssessmentData, 1000);
        // console.log("Failing");
      }
    } catch (err) {
      showDangerToaster(`Error Retrieving Risk Assessment Data`);
      setTimeout(riskAssessmentData, 1000);
    }
  }, [window.data.id, getGlobalGroups, updateViewsList]);

  const removeFromGroup = useCallback(
    async (type, data) => {
      let payload,
        tempConnections = [],
        tempInstObjConnections = [],
        tempinstConnections = [];
      if (type === "risk") {
        payload = { riskObjects: [data.id], dataObjects: [] };
        connections.forEach((connection) => {
          if (
            connection.sourceRef === data.id ||
            connection.targetRef === data.id
          ) {
            tempConnections = [...tempConnections, connection];
          }
        });
        instanceObjectConnections.forEach((connection) => {
          if (
            (connection.sourceRef === data.id &&
              connection.objectType === "Output") ||
            (connection.targetRef === data.id &&
              connection.objectType === "Input")
          ) {
            tempInstObjConnections = [...tempInstObjConnections, connection];
          }
        });
        setConnections((prev) =>
          prev.filter(
            (connection) =>
              connection.sourceRef !== data.id &&
              connection.targetRef !== data.id
          )
        );
        setInstanceObjectConnections((prev) =>
          prev.filter(
            (connection) =>
              (connection.sourceRef !== data.id &&
                connection.objectType === "Output") ||
              (connection.targetRef !== data.id &&
                connection.objectType === "Input")
          )
        );
      } else {
        payload = { riskObjects: [], dataObjects: [data.id] };
        instanceConnections.forEach((connection) => {
          if (
            connection.sourceRef === data.id ||
            connection.targetRef === data.id
          ) {
            tempinstConnections = [...tempinstConnections, connection];
          }
        });
        instanceObjectConnections.forEach((connection) => {
          if (
            (connection.sourceRef === data.id &&
              connection.objectType === "Input") ||
            (connection.targetRef === data.id &&
              connection.objectType === "Output")
          ) {
            tempInstObjConnections = [...tempInstObjConnections, connection];
          }
        });
        setInstanceConnections((prev) =>
          prev.filter(
            (connection) =>
              connection.sourceRef !== data.id &&
              connection.targetRef !== data.id
          )
        );
        setInstanceObjectConnections((prev) =>
          prev.filter(
            (connection) =>
              (connection.sourceRef !== data.id &&
                connection.objectType === "Input") ||
              (connection.targetRef !== data.id &&
                connection.objectType === "Output")
          )
        );
      }
      const response = await editGroup(window.data.id, data.groupId, payload);
      // setConnections([]);
      // setInstanceConnections([]);
      // setInstanceObjectConnections([]);
      // setTimeout(riskAssessmentData, 500);
      // if (type === "risk") {setTimeout(riskAssessmentData, 1000);}else{riskAssessmentData();}
      if (type === "risk") {
        let riskObject;

        setGroups((prev) => {
          return prev.map((group) => {
            if (group.id === data.groupId) {
              riskObject = {
                ...group.elements.find((element) => element.id === data.id),
              };
              return {
                ...group,
                elements: group.elements.filter(
                  (element) => element.id !== data.id
                ),
              };
            } else {
              return group;
            }
          });
        });
        setRiskObjects((prev) => [...prev, riskObject]);
        setConnections((prev) => [...prev, ...tempConnections]);
        setInstanceObjectConnections((prev) => [
          ...prev,
          ...tempInstObjConnections,
        ]);
      } else {
        let dataObject;

        setGroups((prev) => {
          return prev.map((group) => {
            if (group.id === data.groupId) {
              dataObject = {
                ...group.dataObjects.find((object) => object.id === data.id),
              };
              return {
                ...group,
                dataObjects: group.dataObjects.filter(
                  (object) => object.id !== data.id
                ),
              };
            } else {
              return group;
            }
          });
        });
        setDataObjectInstances((prev) => [...prev, dataObject]);
        setInstanceConnections((prev) => [...prev, ...tempinstConnections]);
        setInstanceObjectConnections((prev) => [
          ...prev,
          ...tempInstObjConnections,
        ]);
      }
      // setTimeout(riskAssessmentData, 3000);
      // riskAssessmentData();
    },
    [
      window.data.id,
      connections,
      instanceConnections,
      instanceObjectConnections,
    ]
  );

  const contextMenuAction = useCallback(
    async (path) => {
      try {
        setContextMenu((prev) => ({ ...prev, type: "loading" }));
        // console.log(activeObject);
        const response = await addRiskObjectProperties(activeObject, {
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
    [contextMenu.element, activeObject]
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
          // console.log(payload);
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
          // console.log(payload);
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
          // console.log(payload);
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
      // console.log(e);
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
      // console.log(e, contextX, contextY);
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

      // console.log(type, e.target.parentElement.id, element);
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
          riskObjects: selectedElements
            .filter((item) => item.type !== "instance")
            .map((object) => object.id),
          dataObjects: selectedElements
            .filter((item) => item.type === "instance")
            .map((object) => object.id),
          x: Number(contextMenu.x + 15),
          y: Number(contextMenu.y + 15),
          name: groupName,
          expanded: 1,
        };
        // console.log(payload);
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
        selectedElements.forEach((object) => {
          // removeObjectConnections(object);
        });
        setSelectedElements([]);
        setSelectedObjects([]);
        // setConnections([]);
        // setInstanceObjectConnections([]);
        setTimeout(riskAssessmentData, 500);
        // const redraw = await riskAssessmentData();
      }
    },
    [
      // removeObjectConnections,
      riskAssessmentData,
      window.data.id,
      selectedElements,
      contextMenu,
      groupName,
      setSelectedObjects,
    ]
  );

  const editRiskObject = useCallback(
    async (id, payload, groupId) => {
      // console.log("main", payload);
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
      // console.log(name, description);
      setObjectName(name);
      setObjectDescription(description);
      setContextMenu((prev) => ({ ...prev, type: "create object" }));
    }
    // const object =
  }, [contextMenu.element]);

  const handleObjectAction = useCallback(
    async (element) => {
      // console.log("element", element);

      if (element.operation === "reset") {
        riskAssessmentData();
        return;
      }

      if (element.operation === "resetAll") {
        setConnections([]);
        setInstanceObjectConnections([]);
        riskAssessmentData();
        return;
      }

      if (element.operation === "resetAll") {
        setConnections([]);
        setInstanceObjectConnections([]);
        riskAssessmentData();
        return;
      }

      if (element.operation === "delete" || element.operation === "invisible") {
        // removeObjectConnections(element.object);
      }

      if (element.type === "risk") {
        !element.groupId
          ? setRiskObjects((prev) =>
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
            )
          : setGroups((prev) =>
              prev.map((group) => {
                if (group.id === element.groupId) {
                  return {
                    ...group,
                    elements: group.elements.map((object) => {
                      console.log("inside", object, element);
                      if (object?.id === element.id) {
                        const updatedObject = { ...object };
                        element.operation === "enable"
                          ? (updatedObject["position.enabled"] =
                              element.payload)
                          : (updatedObject["status"] = element.payload);
                        return updatedObject;
                      } else {
                        return object;
                      }
                    }),
                  };
                } else {
                  return group;
                }
              })
            );

        const response =
          element.operation === "enable"
            ? await updateRiskObjectPosition(window.data.id, element.id, {
                enabled: element.payload,
              })
            : await updateRiskObject(element.id, { status: element.payload });
      } else {
        !element.groupId
          ? setDataObjectInstances((prev) =>
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
            )
          : setGroups((prev) =>
              prev.map((group) => {
                if (group.id === element.groupId) {
                  return {
                    ...group,
                    dataObjects: group.dataObjects.map((object) => {
                      if (object?.id === element.id) {
                        const updatedObject = { ...object };
                        element.operation === "enable"
                          ? (updatedObject.disable = element.payload)
                          : (updatedObject.status = element.payload);
                        return updatedObject;
                      } else {
                        return object;
                      }
                    }),
                  };
                } else {
                  return group;
                }
              })
            );

        const response =
          element.operation === "enable"
            ? await updateNewDataObjectInstance(element.id, {
                disable: element.payload,
              })
            : await updateNewDataObjectInstance(element.id, {
                status: element.payload,
              });
      }
      setFirstContext("main");
      setSelectedElements([]);
      setSelectedObjects([]);
    },
    [
      window.data.id,
      riskAssessmentData,
      setSelectedElements,
      setSelectedObjects /* removeObjectConnections*/,
    ]
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
    let connection, connectionType;
    if (selectedElements.length === 2) {
      if (
        selectedElements[0].type === "instance" &&
        selectedElements[1].type === "instance"
      ) {
        connectionType = "instances";
        const first = instanceConnections.find(
          (connection) =>
            connection.sourceRef === selectedElements[0].id &&
            connection.targetRef === selectedElements[1].id
        );
        if (first) {
          connection = first;
        } else {
          const second = instanceConnections.find(
            (connection) =>
              connection.sourceRef === selectedElements[1].id &&
              connection.targetRef === selectedElements[0].id
          );
          if (second) {
            connection = second;
          }
        }
      } else if (
        selectedElements[0].type !== "instance" &&
        selectedElements[1].type !== "instance"
      ) {
        connectionType = "riskObjects";
        const first = connections.find(
          (connection) =>
            connection.sourceRef === selectedElements[0].id &&
            connection.targetRef === selectedElements[1].id
        );
        if (first) {
          connection = first;
        } else {
          const second = connections.find(
            (connection) =>
              connection.sourceRef === selectedElements[1].id &&
              connection.targetRef === selectedElements[0].id
          );
          if (second) {
            connection = second;
          }
        }
      } else {
        connectionType = "instanceRiskObjects";
        let object, instance;

        if (selectedElements[0].type === "instance") {
          instance = selectedElements[0];
          object = selectedElements[1];
        } else {
          instance = selectedElements[1];
          object = selectedElements[0];
        }

        console.log(object, instance);

        if (instance.dataObjectNew.IOtype === "Output") {
          connection = instanceObjectConnections.find(
            (connection) =>
              connection.sourceRef === object.id &&
              connection.targetRef === instance.id
          );
        } else {
          connection = instanceObjectConnections.find(
            (connection) =>
              connection.sourceRef === instance.id &&
              connection.targetRef === object.id
          );
        }
      }

      if (connection) {
        setSelectedConnection({ id: connection.id, type: connectionType });
      } else {
        setSelectedConnection(null);
      }
    } else {
      setSelectedConnection(null);
    }
  }, [
    selectedElements,
    connections,
    instanceConnections,
    instanceObjectConnections,
  ]);

  const handleDisconnect = useCallback(async () => {
    let response;
    switch (selectedConnection?.type) {
      case "riskObjects":
        response = await deleteRiskConnection(selectedConnection.id);
        resetContext();
        setConnections((prev) =>
          prev.filter((connection) => connection.id !== selectedConnection.id)
        );
        break;

      case "instances":
        response = await deleteInstanceConnection(selectedConnection.id);
        resetContext();
        setInstanceConnections((prev) =>
          prev.filter((connection) => connection.id !== selectedConnection.id)
        );
        break;

      case "instanceRiskObjects":
        response = await deleteInstanceRiskConnection(selectedConnection.id);
        resetContext();
        setInstanceObjectConnections((prev) =>
          prev.filter((connection) => connection.id !== selectedConnection.id)
        );
        break;

      default:
        break;
    }
    if (response?.status >= 200 && response?.status < 300) {
      showSuccessToaster(`Connection is removed #${selectedConnection.id}`);
      setSelectedElements([]);
      setSelectedObjects([]);
    } else {
      showDangerToaster(`Can't Remove Connection #${selectedConnection.id}`);
    }

    setSelectedConnection(null);
  }, [
    selectedConnection,
    resetContext,
    setSelectedElements,
    setSelectedObjects,
  ]);

  const importSharedGroup = useCallback(async () => {
    const payload = {
      riskAssessmentId: window.data.id,
      riskGroupId: importGroupId,
      x: contextMenu.x,
      y: contextMenu.y,
      shared: true,
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

  const handleProperties = useCallback(
    (id) => {
      console.log(id);
      // setContextMenu((prev) => ({ ...prev, element: id }));
      // setContextMenu({ element: id });
      setActiveObject(id);
      console.log(activeObject);
    },
    [activeObject]
  );

  const updateDraftLocation = useCallback(async (e, d) => {
    setContextMenu((prev) => ({ ...prev, contextY: d.y, contextX: d.x }));
    if (d.x < 0) {
      setContextMenu((prev) => ({ ...prev, ccontextXx: 0 }));
      d.x = 0;
    }

    if (d.y < 0) {
      setContextMenu((prev) => ({ ...prev, contextY: 0 }));
      d.y = 0;
    }
  }, []);

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
          menu={menu}
          handleProperties={handleProperties}
          removeFromGroup={removeFromGroup}
          checkFilter={checkFilter}
          checkConnctionVisibility={checkConnctionVisibility}
        />
      </Window>
      {/* <div
        className=""
        style={{
          zIndex: 10000000000,
          fontSize: "10px",
          position: "absolute",
          top: contextMenu.contextY,
          left: contextMenu.contextX,
        }}
      > */}
      <Rnd
        position={{
          x: Number(contextMenu.contextX),
          y: Number(contextMenu.contextY),
        }}
        style={{ zIndex: 1000000 }}
        onDragStop={(e, d) => updateDraftLocation(e, d)}
      >
        {/* {contextMenu.active && contextMenu.type === "context" && (
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
        )} */}

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

        {contextMenu.active && contextMenu.type === "view name" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>New View Name</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                postView();
              }}
            >
              <FormGroup
                label="Name"
                labelInfo="(required)"
                labelFor="newViewName"
              >
                <InputGroup
                  required
                  id="newLinkName"
                  onChange={(event) => {
                    setNewViewName(event.target.value);
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
                    setNewViewName(null);
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

        {contextMenu.active && contextMenu.type === "show filters" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>Visibilty Filter</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                postView();
              }}
            >
              {/* <Checkbox
                checked={filter.normal}
                label="Visible Only"
                onClick={() =>
                  setFilter((prev) => ({ ...prev, normal: !prev.normal }))
                }
              />
              <hr /> */}
              <Checkbox
                checked={filter.everything}
                label="All Objects"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    everything: !prev.everything,
                    normal: false,
                  }))
                }
              />
              <hr />
              <Checkbox
                checked={filter.connections}
                label="All Connections"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    connections: !prev.connections,
                    normal: false,
                  }))
                }
              />
              <hr />
              <Checkbox
                checked={filter.riskObjects}
                label="All Risk Objects"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    riskObjects: !prev.riskObjects,
                    normal: false,
                  }))
                }
              />
              <Checkbox
                checked={filter.vObjects | filter.riskObjects}
                label="All Virtual Risk Objects"
                disabled={filter.riskObjects}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    vObjects: !prev.vObjects,
                    normal: false,
                  }))
                }
              />
              <Checkbox
                checked={filter.pObjects | filter.riskObjects}
                label="All Physical Risk Objects"
                disabled={filter.riskObjects}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    pObjects: !prev.pObjects,
                    normal: false,
                  }))
                }
              />
              <Checkbox
                checked={filter.mObjects | filter.riskObjects}
                label="All Model Risk Objects"
                disabled={filter.riskObjects}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    mObjects: !prev.mObjects,
                    normal: false,
                  }))
                }
              />
              <hr />
              <Checkbox
                checked={filter.dataObjects}
                label="All Data Objects"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    dataObjects: !prev.dataObjects,
                    normal: false,
                  }))
                }
              />
              <Checkbox
                checked={filter.iDataObjects | filter.dataObjects}
                label="All Input Data Objects"
                disabled={filter.dataObjects}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    iDataObjects: !prev.iDataObjects,
                    normal: false,
                  }))
                }
              />
              <Checkbox
                checked={filter.oDataObjects | filter.dataObjects}
                label="All Output Data Objects"
                disabled={filter.dataObjects}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    oDataObjects: !prev.oDataObjects,
                    normal: false,
                  }))
                }
              />
              <hr />
              <Checkbox
                checked={filter.groups}
                label="All Groups"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    groups: !prev.groups,
                    normal: false,
                  }))
                }
              />
              <hr />
              <Checkbox
                checked={filter.disabled}
                label="All Disabled"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    disabled: !prev.disabled,
                    normal: false,
                  }))
                }
              />
              <hr />
              Save View As
              <FormGroup
                label="Name"
                labelInfo="(required)"
                labelFor="newViewName"
              >
                <InputGroup
                  required
                  id="newLinkName"
                  onChange={(event) => {
                    setNewViewName(event.target.value);
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
                    setNewViewName(null);
                    resetContext();
                  }}
                >
                  Close
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

        {contextMenu.active && contextMenu.type === "create" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Show Filters"
              onClick={() =>
                setContextMenu((prev) => ({ ...prev, type: "show filters" }))
              }
            >
              {/* <MenuItem
                intent={filter.normal ? "primary" : ""}
                onClick={() =>
                  setFilter((prev) => ({ ...prev, normal: !prev.normal }))
                }
                text="Show Visible Only"
              /> */}
              <MenuItem
                intent={filter.everything ? "primary" : ""}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    everything: !prev.everything,
                    normal: false,
                  }))
                }
                text={
                  filter.everything ? `Hide All Objects` : `Show All Objects`
                }
              />
              <MenuItem
                intent={filter.connections ? "primary" : ""}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    connections: !prev.connections,
                    normal: false,
                  }))
                }
                text={
                  filter.connections
                    ? `Hide All Connections`
                    : `Show All Connections`
                }
              />
              <MenuItem
                intent={filter.riskObjects ? "primary" : ""}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    riskObjects: !prev.riskObjects,
                    normal: false,
                  }))
                }
                text={
                  filter.riskObjects
                    ? `Hide All Risk Objects`
                    : `Show All Risk Objects`
                }
              >
                <MenuItem
                  intent={filter.pObjects ? "primary" : ""}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      pObjects: !prev.pObjects,
                      normal: false,
                    }))
                  }
                  text={
                    filter.pObjects
                      ? `Hide Physical Risk Objects`
                      : `Show Physical Risk Objects`
                  }
                />
                <MenuItem
                  intent={filter.vObjects ? "primary" : ""}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      vObjects: !prev.vObjects,
                      normal: false,
                    }))
                  }
                  text={
                    filter.vObjects
                      ? `Hide Virtual Risk Objects`
                      : `Show Virtual Risk Objects`
                  }
                />
                <MenuItem
                  intent={filter.mObjects ? "primary" : ""}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      mObjects: !prev.mObjects,
                      normal: false,
                    }))
                  }
                  text={
                    filter.mObjects
                      ? `Hide Model Risk Objects`
                      : `Show Model Risk Objects`
                  }
                />
              </MenuItem>
              <MenuItem
                intent={filter.dataObjects ? "primary" : ""}
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    dataObjects: !prev.dataObjects,
                    normal: false,
                  }))
                }
                text={
                  filter.dataObjects
                    ? `Hide All Data Objects`
                    : `Show All Data Objects`
                }
              >
                <MenuItem
                  intent={filter.iDataObjects ? "primary" : ""}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      iDataObjects: !prev.iDataObjects,
                      normal: false,
                    }))
                  }
                  text={
                    filter.iDataObjects
                      ? `Hide Input Data Objects`
                      : `Show Input Data Objects`
                  }
                />
                <MenuItem
                  intent={filter.oDataObjects ? "primary" : ""}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      oDataObjects: !prev.oDataObjects,
                      normal: false,
                    }))
                  }
                  text={
                    filter.oDataObjects
                      ? `Hide Output Data Objects`
                      : `Show Output Data Objects`
                  }
                />
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() =>
                  setContextMenu((prev) => ({ ...prev, type: "view name" }))
                }
                text="Save View As"
              />
              <MenuItem text="Show View">
                {viewsList.map((view) => (
                  <MenuItem
                    intent={view.current ? "primary" : "none"}
                    text={view.name}
                    onClick={changeView.bind(null, [view.id])}
                  />
                ))}
              </MenuItem>
              <MenuDivider />
            </MenuItem>
            <MenuDivider />
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
                  // required
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
        {/* </div> */}
      </Rnd>
    </>
  );
};
