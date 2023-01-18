import {
  Intent,
  // Spinner,
  // Switch,
  // Icon,
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
  NumericInput,
} from "@blueprintjs/core";
import openSocket from "socket.io-client";
// import {ContextMenuComponent} from "../../../../../components/FlowChart/context/contextMenuComponent"
// import { Classes } from '@blueprintjs/popover2'
import { useCallback, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Console } from "../../../../../components/riskAssessment/console";
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
  editRiskConnection,
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
  addObjectToGroup,
  unshareGroup,
  addModelRiskObjectProperties,
  getBayesianCharts,
  getGenericCharts,
  getAnalysispackCharts,
  getAnalysisPacks,
  getMetaData,
  getDataObject,
  addVisualObject,
  editVisualObject,
  deleteVisualObject,
  editAnalyticsChart,
  deleteAnalyticsChart,
  getAnalyticsChartsCausal,
} from "../../../../../services";
import { windowDefault,BACKEND_URI } from "../../../../../constants";
import {
  showDangerToaster,
  showSuccessToaster,
} from "../../../../../utils/toaster";
import { objectSelectorState } from "../../../../../store/objectSelector";
import { Window } from "../window";
import { RiskAssessment } from "../../../../../components/riskAssessment";
import { index } from "d3";
import {
  windowFamily,
  windowsState,
  windowsIds,
} from "../../../../../store/windows";
import { generateID } from "../../../../../utils/generateID";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { data } from "vis-network";
import { show } from "@blueprintjs/core/lib/esm/components/context-menu/contextMenu";
// import { show } from "@blueprintjs/core/lib/esm/components/context-menu/contextMenu";
// import { map, set } from "lodash";
// import { data } from "vis-network";
// import { easeExpInOut } from "d3";
export const RiskAssessmentWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [logs,setLogs]=useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario,setSelectedScenario]=useState(null);
  const [selectedScenarioRun,setSelectedScenarioRun]=useState(null);
  const [selectedVisualObject, setSelectedVisualObject] = useState(null);
  const [voFilePath, setVoFilePath] = useState(null);
  const [voText, setVoText] = useState(null);
  const [voName, setVoName] = useState(null);
  const [visualObjects, setVisualObjects] = useState([]);
  const [linkProperties, setLinkProperties] = useState([]);
  const [views, setViews] = useState(["mini", "default", "open", "full"]);
  const [globalViewIndex, setGlobalViewIndex] = useState(3);
  const [charts, setCharts] = useState([]);
  const [analyticsCharts, setAnalyticsCharts] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [openedGroup, setOpenedGroup] = useState(null);
  const [openedGroupConnections, setOpenedGroupConnections] = useState([]);
  const [modularGroupAction, setModularGroupAction] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [firstContext, setFirstContext] = useState("main");
  const [elementEnable, setElementEnable] = useState(true);
  const [groupName, setGroupName] = useState(null);
  const [groupDescription, setGroupDescription] = useState(null);
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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [connectionWeight, setConnectionWeight] = useState(0);
  const [connectionText, setConnectionText] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [editConnection, setEditConnection] = useState(false);
  const [topPosition, setTopPosition] = useState({ top: 50000, left: 50000 });
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
  const [confidenceLevel, setConfidenceLevel] = useState(1);
  const [causeProperty, setCauseProperty] = useState(null);
  const [effectProperty, setEffectProperty] = useState(null);
  const [globalGroups, setGlobalGroups] = useState([]);
  const [globalDataObjects, setGlobalDataObjects] = useState([]);
  const [editElement, setEditElement] = useState(null);
  const [riskObjects, setRiskObjects] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [metaDataList, setMetaDataList] = useState([]);
  const [connections, setConnections] = useState([]);
  const [instanceConnections, setInstanceConnections] = useState([]);
  const [instanceObjectConnections, setInstanceObjectConnections] = useState(
    []
  );
  const [linkProperty, setLinkProperty] = useState(null);

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
  const [modularGroup, setModularGroup] = useState(false);
  const [editGroupFlag, setEditGroupFlag] = useState(false);
  const [analysisPacks, setAnalysisPacks] = useState([]);

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

  const initialSocket = useCallback(() => {
    console.log('initial socket');
    const socket = openSocket(`${BACKEND_URI}:8080`);
    socket.on(`analytics_progress_${window.data.id}`, (log) => {
      setLogs(prev=>([...prev,log]))
    });
    return socket;
  }, [window.data.id,]);

  useEffect(()=>{initialSocket()},[initialSocket])

  useEffect(()=>{
    if(scenarios.length===0)return;
    setSelectedScenario(scenarios[0])
    setSelectedScenarioRun(scenarios[0].SenarioRuns[0]);
  },[scenarios])

  const checkMaximized = useRecoilCallback(
    ({ set, snapshot }) =>
      () => {
        const getWindowsIdsList = snapshot.getLoadable(windowsIds).contents;

        return getWindowsIdsList.find(
          (element) =>
            snapshot.getLoadable(windowFamily(element)).contents.maximized
        );
      },
    []
  );

  const setWindowCallBack = useRecoilCallback(
    ({ set, snapshot }) =>
      ({ data, type }) => {
        const getWindowsIdsList = snapshot.getLoadable(windowsIds).contents;

        const check = checkMaximized();

        if (check) {
          let old = snapshot.getLoadable(windowFamily(check)).contents;
          set(windowFamily(check), {
            ...old,
            maximized: false,
            collapse: true,
          });
        }

        const id = generateID();
        const windowData = {
          type,
          data,
          id,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: check ? true : false,
        };

        console.log(windowData);

        set(windowsIds, (prev) => [id, ...prev]);
        set(windowFamily(id), windowData);
      },
    []
  );

  const addNotebookWindow = useCallback(
    ({ data, type }) => {
      setWindowCallBack({ data, type });
    },
    [setWindowCallBack]
  );

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
    setObjectName(null);
    setObjectDescription(null);
    setEditElement(null);
    // setActiveObject(null);
  }, []);

  const fetchAnalysisPacks = useCallback(async () => {
    const { data } = await getAnalysisPacks();
    setAnalysisPacks(data.data);
  }, []);

  const fetchMetaData = useCallback(async () => {
    const { data } = await getMetaData();
    setMetaDataList(data.data);
  }, []);

  useEffect(() => {
    fetchAnalysisPacks();
    fetchMetaData();
  }, [fetchAnalysisPacks, fetchMetaData]);

  useEffect(() => {
    if (openedGroup) {
      let elements = groups
        .find((grp) => grp.id === openedGroup)
        .elements.map((elm) => ({ id: elm.id }));
      console.log("elements", elements);
      setOpenedGroupConnections(
        connections.filter(
          (con) =>
            elements.find((elm) => elm.id === con.sourceRef) &&
            elements.find((elm) => elm.id === con.targetRef)
        )
      );
    } else {
      setOpenedGroupConnections([]);
      // setConnections([])
    }
  }, [openedGroup, connections, groups]);

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

          if (object && group === null) {
            group = grp;
            //  ("grp-obj",object, grp,id, type);
            // ("obj", object, Date.now());
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
      // (type, status, filter, check);
      return check;
    },
    [filter]
  );

  const checkConnctionVisibility = useCallback(
    (connection, type) => {
      let check = false;
      let target, source;
      if (connection.sourceRef === connection.targetRef) return false;
      if (connection.status === "delete") return false;
      if (!filter.everything && !filter.normal && !filter.connections)
        return false;

      switch (type) {
        case "riskObjects":
          target = checkObject(connection.sourceRef, "risk");
          source = checkObject(connection.targetRef, "risk");

          if (!target.object || !source.object) return false;
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
                : target.group.modelGroup
                ? true
                : target.group.modelGroup
                ? true
                : "collapsed";

            if (target.group.modelGroup && target.group.id !== openedGroup) {
              if (
                !(
                  target.object.description?.includes("input") ||
                  target.object.description?.includes("output")
                )
              ) {
                check = false;
              }
            }
          }

          if (source.group) {
            check =
              source.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? check === "collapsed"
                  ? "collapsed"
                  : true
                : source.group.modelGroup
                ? true
                : "collapsed";

            if (source.group?.modelGroup && source.group?.id !== openedGroup) {
              if (
                !(
                  source.object.description?.includes("input") ||
                  source.object.description?.includes("output")
                )
              ) {
                check = false;
              }
            }
          }

          if (
            source.group?.id === target.group?.id &&
            source.group?.modelGroup &&
            source.group?.id !== openedGroup
          ) {
            if (
              !(
                (source.object.description?.includes("input") ||
                  source.object.description?.includes("output")) &&
                (target.object.description?.includes("input") ||
                  target.object.description?.includes("output"))
              )
            ) {
              check = false;
            }
          }

          // (target, source);
          break;

        case "dataObjects":
          target = checkObject(connection.sourceRef, "instance");
          source = checkObject(connection.targetRef, "instance");
          if (!target.object || !source.object) return false;
          // (
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
          // (check);
          if (!check) return false;

          if (target.group) {
            check =
              target.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : "collapsed";
          }

          if (source.group) {
            check =
              source.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? check === "collapsed"
                  ? "collapsed"
                  : true
                : "collapsed";
          }
          break;

        case "riskDataObjects":
          if (connection.objectType === "Output") {
            source = checkObject(connection.sourceRef, "risk");
            target = checkObject(connection.targetRef, "instance");
            if (!target.object || !source.object) return false;
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
            if (!target.object || !source.object) return false;
            // ("==========", source, target, connection);
            check =
              checkFilter(
                source.object?.dataObjectNew.IOtype,
                source.object?.status,
                source.object?.disable
              ) &&
              checkFilter(
                target.object?.type,
                target.object?.status,
                !target?.object["position.enabled"]
              );
          }
          if (!check) return false;

          if (target.group) {
            check =
              target.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? true
                : "collapsed";
          }

          if (source.group) {
            check =
              source.group.expanded &&
              (filter.groups || filter.normal || filter.everything)
                ? check === "collapsed"
                  ? "collapsed"
                  : true
                : "collapsed";
          }
          break;

        default:
          break;
      }
      if (check === "collapsed" && target.group?.id === source.group?.id) {
        check = "collapsedGroup";
      }
      // ("check", check, connection,target,source);
      return check;
    },
    [
      checkFilter,
      checkObject,
      filter.connections,
      filter.everything,
      filter.normal,
      filter.groups,
      openedGroup,
    ]
  );

  const updateViewsList = useCallback(async () => {
    setIsServiceLoading(true);
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
    setIsServiceLoading(false);
  }, [window.data.id]);

  const changeView = useCallback(
    async (id) => {
      // (viewsList);
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
    // ("remove connection", obj.type);
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

  // useEffect(()=>{
  //   if(openedGroup){
  //     console.log("IN",openedGroup)
  //     setRiskObjects([]);
  //     setDataObjectInstances([]);
  //     setMetaData([]);
  //     setGroups(groups.filter(grp=>grp.id===openedGroup));
  //   }
  // },[openedGroup,groups])

  const getCenter = useCallback(() => {
    let objectsArray = [...riskObjects];
    let top = 50000;
    let left = 50000;
    groups.forEach((grp) => {
      if (grp.elements.length > 1) {
        objectsArray = [...objectsArray, ...grp.elements];
      }
    });

    objectsArray.forEach((obj) => {
      if (obj !== null) {
        top = obj["position.y"] < top ? obj["position.y"] : top;
        left = obj["position.x"] < left ? obj["position.x"] : left;
      }
    });

    setTopPosition({ top, left });
  }, [riskObjects, groups]);

  const visualObjectEdit = useCallback((data) => {
    console.log("in2", data);
    // setContextMenu((prev) => ({
    //   ...prev,
    //   active: true,
    //   type: "create visual object",
    //   contextX: data.x,
    //   contextY: data.y,
    // }));
    setSelectedVisualObject(data);
  }, []);

  useEffect(() => {
    if (!selectedVisualObject) return;
    console.log("Ready to show");
    setContextMenu({
      active:true,
      type: "create visual object",
      contextX: Number(selectedVisualObject.x),
      contextY: Number(selectedVisualObject.y),
    });
  }, [selectedVisualObject]);
  const riskAssessmentData = useCallback(async () => {
    // if(openedGroup) return;
    try {
      const response = await getRiskAssessment(window.data.id);
      if (response.status === 200) {
        if (openedGroup) {
          console.log("IN", openedGroup);
          setRiskObjects([]);
          setDataObjectInstances([]);
          setGroups([
            {
              ...response.data.data.riskGroups.find(
                (grp) => grp.id === openedGroup
              ),
              opendGroupExpansion: 1,
            },
          ]);
        } else {
          console.log("Out", openedGroup);
          setRiskObjects(response.data.data.riskObjects);
          setDataObjectInstances(response.data.data.dataObjectsNewProperties);
          setMetaData(response.data.data.metaData.referenceGroupJsons[0].json);
          setLinkProperties(
            response.data.data.metaData.referenceGroupJsons[0].json.filter(
              (l1) => l1.name === "Analytical_Node_List"
            )
          );
          setGroups(response.data.data.riskGroups);
          setCharts(
            response.data.data.charts.filter((chart) => chart.riskObjectId)
          );
          getCenter();
          setAnalyticsCharts(
            response.data.data.charts.filter(
              (chart) => (chart.riskObjectId === null && chart.status!=="deleted")
            )
          );
          setNotebooks(response.data.data.notebooks);
          setVisualObjects(response.data.data.textObjects);
          setScenarios( response.data.data.senarios);
        }

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
        setDataLoaded(true);
        // getDeleted();
      } else {
        showDangerToaster(`Error Retrieving Risk Assessment Data`);
        setTimeout(riskAssessmentData, 1000);
      }
    } catch (err) {
      showDangerToaster(`Error Retrieving Risk Assessment Data`);
      setTimeout(riskAssessmentData, 1000);
    }
  }, [window.data.id, getGlobalGroups, updateViewsList, openedGroup]);

  const handleVisualObjectCreation = useCallback(async () => {
    setIsServiceLoading(true);
    let payload = new FormData();
    payload.append("fileUpload", voFilePath);
    payload.append("riskAssessmentId", window.data.id);
    payload.append("text", voText);
    payload.append("name", voName);
    payload.append("x", contextMenu.offsetX);
    payload.append("y", contextMenu.offsetY);
    const response = await addVisualObject(payload);
    if (response.status >= 200 && response.status < 300) {
      setVisualObjects((prev) => [...prev, response.data.data]);
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
      showDangerToaster(`Can't Create Object`);
    }

    setIsServiceLoading(false);
  }, [window.data.id, voFilePath, voName, voText, contextMenu]);

  const getAnalytics = useCallback(
    async (type, data) => {
      setIsServiceLoading(true);
      let response;
      try {
        switch (type) {
          case "bayesian":
            response = await getBayesianCharts({
              riskAssessmentId: window.data.id,
            });
            break;
          case "generic":
            response = await getGenericCharts({
              riskAssessmentId: window.data.id,
            });
            break;
          case "analysispack":
            response = await getAnalysispackCharts({
              riskAssessmentId: window.data.id,
              ...data,
            });
            break;
          case "analysispackcausal":
            response = await getAnalyticsChartsCausal({
              riskAssessmentId: window.data.id,
              ...data,
            });
            break;
          default:
            return;
        }

        if (response?.status >= 200 && response?.status < 300) {
          riskAssessmentData();
          return response;
        } else {
          throw new Error("Error Getting Analytic Data");
        }
      } catch (error) {
        showDangerToaster(`${error}`);
      }
      setIsServiceLoading(false);
    },
    [window.data.id, riskAssessmentData]
  );
  const handleOpenedGroup = useCallback(
    (id, action) => {
      if (action === "clear") {
        // setGroups([{...groups.find(grp=>grp.id===openedGroup),opendGroupExpansion:false}])
        // setConnections([]);
        // setRiskObjects([]);
        setGroups([
          {
            ...groups.find((grp) => grp.id === openedGroup),
            opendGroupExpansion: false,
          },
        ]);
        // setGroups([]);
        // setConnections([]);
        setOpenedGroupConnections([]);
        setOpenedGroup(null);

        // riskAssessmentData();
      } else {
        console.log("Original", id, action);
        setOpenedGroup(id);
        setRiskObjects([]);
        setDataObjectInstances([]);
        setGroups([
          { ...groups.find((grp) => grp.id === id), opendGroupExpansion: true },
        ]);
      }
    },
    [groups, openedGroup]
  );

  const updateGenericChartVisibilty = useCallback(async (id, visible) => {
    const response = await editAnalyticsChart(id, { visible });
    if (response.status < 200 || response.status > 300) {
      showDangerToaster(`Faild to update chart visibilty #${id}`);
    }
  }, []);

  const analyticsChartsDelete = useCallback(async (id)=>{
    const response = await deleteAnalyticsChart(id);
    if(response.status>=200 && response.status<300){
      analyticsCharts.filter(chart=>chart.id!==id)
    }else{
      showDangerToaster(`Faild Deleteing Chart #${id}`)
    }
  },[analyticsCharts])

  const analyticsChartsFilter = useCallback(
    (req, pos) => {
      if (req === "all") {
        analyticsCharts.forEach((chart) =>
          updateGenericChartVisibilty(chart.id, true)
        );
        setAnalyticsCharts((prev) =>
          prev.map((chart) => ({
            ...chart,
            visible: true,
            x: chart.x === 0 ? pos.x : chart.x,
            y: chart.y === 0 ? pos.y : chart.y,
          }))
        );
      } else {
        updateGenericChartVisibilty(
          req,
          !analyticsCharts.find((chart) => chart.id === req).visible
        );
        setAnalyticsCharts((prev) =>
          prev.map((chart) => {
            if (chart.id === req) {
              console.log(req, pos, chart);
              return {
                ...chart,
                visible: !chart.visible,
                x: chart.x === 0 ? pos.x : chart.x,
                y: chart.y === 0 ? pos.y : chart.y,
              };
            } else {
              return chart;
            }
          })
        );
      }
    },
    [analyticsCharts, updateGenericChartVisibilty]
  );

  const addToGroup = useCallback(
    async (type, data) => {
      setIsServiceLoading(true);
      let payload,
        tempConnections = [],
        tempInstObjConnections = [],
        tempinstConnections = [];
      try {
        if (type === "risk") {
          payload = { riskObjectId: data.id };
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
          payload = { dataObjectId: data.id };
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

        const response = await addObjectToGroup({
          ...payload,
          riskAssessmentId: window.data.id,
          riskGroupId: data.groupId,
        });

        if (response.status >= 200 && response.status < 300) {
          if (type === "risk") {
            let riskObject;
            setRiskObjects((prev) =>
              prev.filter((item) => item.id !== data.id)
            );
            setGroups((prev) => {
              return prev.map((group) => {
                if (Number(group.id) === Number(data.groupId)) {
                  return {
                    ...group,
                    elements: [...group.elements, data],
                  };
                } else {
                  return group;
                }
              });
            });

            setConnections((prev) => [...prev, ...tempConnections]);
            setInstanceObjectConnections((prev) => [
              ...prev,
              ...tempInstObjConnections,
            ]);
          } else {
            let dataObject;
            setDataObjectInstances((prev) =>
              prev.filter((item) => item.id !== data.id)
            );
            setGroups((prev) => {
              return prev.map((group) => {
                if (Number(group.id) === Number(data.groupId)) {
                  return {
                    ...group,
                    dataObjects: [...group.dataObjects, data],
                  };
                } else {
                  return group;
                }
              });
            });

            setInstanceConnections((prev) => [...prev, ...tempinstConnections]);
            setInstanceObjectConnections((prev) => [
              ...prev,
              ...tempInstObjConnections,
            ]);
          }
        } else {
          showDangerToaster(`Can't add to group`);
        }
      } catch (error) {
        showDangerToaster(`Can't add to group`);
      }
      setIsServiceLoading(false);
    },
    [
      window.data.id,
      connections,
      instanceConnections,
      instanceObjectConnections,
    ]
  );

  const removeFromGroup = useCallback(
    async (type, data) => {
      setIsServiceLoading(true);
      let payload,
        tempConnections = [],
        tempInstObjConnections = [],
        tempinstConnections = [];
      try {
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
      } catch (error) {
        showDangerToaster(`Can't remove from group`);
      }

      const response = await editGroup(window.data.id, data.groupId, payload);
      if (response.status >= 200 && response.status < 300) {
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
      } else {
        showDangerToaster(`Can't remove from group`);
      }

      setIsServiceLoading(false);
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
        // (activeObject);
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
      setIsServiceLoading(true);
      if (data.type === "connect") {
        if (
          selectedElements[0].type !== "instance" &&
          selectedElements[1].type !== "instance"
        ) {
          // ("risks");
          let input = selectedElements.find((element) =>
            String(element.description).includes("input")
          );
          let output = selectedElements.find((element) =>
            String(element.description).includes("output")
          );

          if (!(input && output)) {
            input = selectedElements[1];
            output = selectedElements[0];
          }
          if (input && !output) {
            output = selectedElements.find((elm) => elm.id !== input.id);
          }
          if (!input && output) {
            input = selectedElements.find((elm) => elm.id !== output.id);
          }
          let payload = {
            sourceRef: input ? output.id : selectedElements[0].id,
            targetRef: output ? input.id : selectedElements[1].id,
            riskAssessmentId: window.data.id,
            name: linkName,
            scalar: connectionWeight,
            text: connectionText,
            confidenceLevel,
            causeProperty,
            effectProperty,
            linkProperty,
          };

          const response = await addRiskConnection(payload);
          setConnections((prev) => [...prev, response.data.data]);
          setSelectedElements([]);
          setSelectedObjects([]);
          // (payload);
        } else if (
          selectedElements[0].type === "instance" &&
          selectedElements[1].type === "instance"
        ) {
          let payload = {
            sourceRef: selectedElements[0].id,
            targetRef: selectedElements[1].id,
            riskAssessmentId: window.data.id,
            name: linkName,
            scalar: connectionWeight,
            text: connectionText,
            confidenceLevel,
            causeProperty,
            effectProperty,
            linkProperty,
          };

          const response = await addInstanceConnection(payload);
          setInstanceConnections((prev) => [...prev, response.data.data]);
          setSelectedElements([]);
          setSelectedObjects([]);
          // (payload);
        } else {
          let instance, object, source, target;
          if (selectedElements[0].type === "instance") {
            instance = selectedElements[0];
            object = selectedElements[1];
          } else {
            instance = selectedElements[1];
            object = selectedElements[0];
          }
          // (instance.dataObjectNew.IOtype,object);
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
            scalar: connectionWeight,
            text: connectionText,
            confidenceLevel,
            causeProperty,
            effectProperty,
            linkProperty,
            objectType:
              instance.dataObjectNew.IOtype === "Input" ? "Input" : "Output",
          };

          const response = await addInstanceObjectConnection(payload);
          setInstanceObjectConnections((prev) => [...prev, response.data.data]);
          setSelectedElements([]);
          setSelectedObjects([]);
          // (payload);
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
      setIsServiceLoading(false);
    },
    [
      window.data.id,
      selectedElements,
      setConnections,
      linkName,
      setSelectedObjects,
      connectionText,
      connectionWeight,
      confidenceLevel,
      causeProperty,
      effectProperty,
      linkProperty,
    ]
  );

  useEffect(() => {
    if (selectedConnection) {
      setLinkName(selectedConnection.name);
      setConnectionText(selectedConnection.text);
      setConnectionWeight(selectedConnection.scalar);
      setConfidenceLevel(selectedConnection.confidenceLevel);
      setCauseProperty(selectedConnection.causeProperty);
      setEffectProperty(selectedConnection.effectProperty);
      setLinkProperty(selectedConnection.linkProperty);
    } else {
      setLinkName(null);
      setConnectionText(null);
      setConnectionWeight(0);
      setConfidenceLevel(1);
      setCauseProperty(null);
      setEffectProperty(null);
      setLinkProperty(null);
    }
  }, [selectedConnection]);

  useEffect(() => {
    riskAssessmentData();
  }, [riskAssessmentData]);

  const getChildren = useCallback(
    (object) => {
      return object?.children.length > 0 ? (
        <MenuItem
          MenuItem
          text={object.name}
          onClick={() => contextMenuAction([...object.testPath, object.id])}
        >
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

  const setModelRiskObjectProperties = useCallback(async (mdl2Id, riskObj) => {
    try {
      const { object } = riskObj;

      if (object?.type === "model") {
        const response = await addModelRiskObjectProperties(object.id, {
          metaDataLevel2Id: mdl2Id,
        });

        if (response) {
          showSuccessToaster(
            `Successfully Added Properties to Risk Object ${object.id}`
          );
        }
      } else {
        throw new Error(
          "Validation Error: Setting model properties behavior must be on Model Riskobject"
        );
      }
    } catch (error) {
      showDangerToaster(error.message);
    }
  }, []);

  const menu = metaData.map((l1) => {
    return (
      <MenuItem text={l1.name}>
        {l1.metaDataLevel2.map((l2) => {
          return (
            <MenuItem
              text={l2.name}
              onClick={() =>
                setModelRiskObjectProperties(
                  l2.id,
                  checkObject(activeObject, "risk")
                )
              }
            >
              {l2.dataObjects[0]?.children
                ? l2.dataObjects[0].children.map((l1Do) => getChildren(l1Do))
                : null}
            </MenuItem>
          );
        })}
      </MenuItem>
    );
  });

  // (menu);

  const getContextPosition = useCallback((e) => {
    const rect = document
      .querySelector("#mainContainer")
      .getBoundingClientRect();
    const scrollDiv = document.querySelector("#mainContainer");
    const contextX = e.pageX - rect.left;
    const contextY = e.pageY - rect.top + scrollDiv.scrollTop;
    let x = e.nativeEvent.layerX;
    let y = e.nativeEvent.layerY;
    let offsetX = e.nativeEvent.offsetX;
    let offsetY = e.nativeEvent.offsetY;

    return { contextX, contextY, x, y, offsetX, offsetY };
  }, []);

  const handleContextMenu = useCallback(
    async (e, data) => {
      console.log(e, data);
      if (firstContext === "risk" && selectedElements.length < 2) return;
      if (data.id) {
        setActiveObject(data.id);
      }
      e.preventDefault();

      if (data && !data.from) {
        if (data["position.enabled"]) {
          setElementEnable(true);
        } else {
          setElementEnable(false);
        }
      }

      let type, id, element;
      // const rect = document
      //   .querySelector("#mainContainer")
      //   .getBoundingClientRect();
      // const scrollDiv = document.querySelector("#mainContainer");
      // const contextX = e.pageX - rect.left;
      // const contextY = e.pageY - rect.top + scrollDiv.scrollTop;
      // let x = e.nativeEvent.layerX;
      // let y = e.nativeEvent.layerY;
      // let offsetX = e.nativeEvent.offsetX;
      // let offsetY = e.nativeEvent.offsetY;
      let { contextX, contextY, x, y, offsetX, offsetY } =
        getContextPosition(e);
      // (e, contextX, contextY);
      if (data.from === "main" && firstContext === "main") {
        type = "create";
        // x = e.nativeEvent.layerX+ 20;
        // y = e.nativeEvent.layerY + 50;
      } else if (firstContext === "group") {
        type = "template";
        setFirstContext("template");
        id = e.target.id.split("-")[1];
      } else if (firstContext === "DO") {
        // if (e.target.id.split("-").length === 3){
        //   id = e.target.id.split("-")[3];
        // }
        if (selectedElements.length === 0) {
          type = "contextDO";
          setFirstContext("contextDO");
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
      } else if (firstContext === "element") {
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
      }else if (firstContext === "visualObject") {
        type = "visualObject";
          setFirstContext("visualObject");
          // element=
      }else if (firstContext === "chartObject") {
        type = "chartObject";
          setFirstContext("chartObject");
          // element=
      }
      element = id
        ? Number(id)
        : Number(e.target.parentElement.id.split("-")[2]);

      if (!element || typeof element !== "number")
        element = Number(e.target.parentElement.className.split(" ")[1]);

      setContextMenu((prev) => ({
        active: true,
        type,
        x,
        y,
        contextX,
        contextY,
        element,
        offsetX: data.from === "main" ? offsetX : prev.offsetX,
        offsetY: data.from === "main" ? offsetY : prev.offsetY,
      }));
    },
    [setContextMenu, selectedElements, firstContext, getContextPosition]
  );

  const addNewTemplate = useCallback(async () => {
    setIsServiceLoading(true);
    const payload = {
      riskGroupId: contextMenu.element,
      name: templateName,
    };

    const response = await addRiskTemplate(payload);
    if (response.status >= 200 && response.status < 300) {
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
    } else {
      showDangerToaster(`Can't Import Template`);
    }

    setIsServiceLoading(false);
    // const redraw = await riskAssessmentData();
  }, [riskAssessmentData, contextMenu, templateName]);

  const handleGrouping = useCallback(
    async (data) => {
      if (data.type === "group") {
        let x, y;
        const lastElement = selectedElements[selectedElements.length - 1];
        if (lastElement.type === "instance") {
          x = lastElement.x;
          y = lastElement.y;
        } else {
          x = lastElement["position.x"];
          y = lastElement["position.y"];
        }

        const payload = {
          riskAssessmentId: window.data.id,
          riskObjects: selectedElements
            .filter((item) => item.type !== "instance")
            .map((object) => object.id),
          dataObjects: selectedElements
            .filter((item) => item.type === "instance")
            .map((object) => object.id),
          x: x + 75,
          y: y + 75,
          name: groupName,
          expanded: 1,
          modelGroup: modularGroup,
          description: groupDescription,
        };
        setIsServiceLoading(true);
        const response = await addRiskAssessmentGroup(payload);
        if (response.status >= 200 && response.status < 300) {
          resetContext();
          setGroupName(null);
          setSelectedElements([]);
          setSelectedObjects([]);
          setGroupDescription(null);
          setTimeout(riskAssessmentData, 500);
        } else {
          showDangerToaster(`Can't Create Group`);
        }

        setIsServiceLoading(false);
      }
    },
    [
      riskAssessmentData,
      window.data.id,
      selectedElements,
      groupName,
      setSelectedObjects,
      resetContext,
      modularGroup,
      groupDescription,
    ]
  );

  const editRiskObject = useCallback(
    async (id, payload, groupId) => {
      setIsServiceLoading(true);
      const response = await updateRiskObject(id, payload);
      if (response.status === 200) {
        riskAssessmentData();
      } else {
        showDangerToaster(`Update Faild`);
      }
      setIsServiceLoading(false);
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
              x: contextMenu.offsetX,
              y: contextMenu.offsetY,
              riskAssessmentId: window.data.id,
              enabled: true,
            };

        if (editElement) {
          const response = await updateRiskObject(editElement, payload);
          setRiskObjects((prev) =>
            prev.map((obj) => {
              if (Number(obj.id) === Number(editElement)) {
                return {
                  ...obj,
                  name: objectName,
                  description: objectDescription,
                };
              } else {
                return obj;
              }
            })
          );
          setGroups((prev) =>
            prev.map((grp) => ({
              ...grp,
              ...grp.elements.map((element) => {
                if (Number(element?.id) === Number(editElement)) {
                  return {
                    ...element,
                    name: objectName,
                    description: objectDescription,
                  };
                } else {
                  return element;
                }
              }),
            }))
          );
          riskAssessmentData();
        } else {
          const response = await addNewRiskObject(payload);
          if (response.status === 201) {
            const newObject = { ...response.data.data };
            newObject["position.x"] =
              response.data.data.riskObjectsPositions[0].x;
            newObject["position.y"] =
              response.data.data.riskObjectsPositions[0].y;
            newObject["position.width"] = 270;
            newObject["position.height"] = 170;
            newObject["position.enabled"] = 1;
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
      setIsServiceLoading(true);
      try {
        const payload = {
          riskAssessmentId: window.data.id,
          riskTemplateId: importTemplateId,
          name: importTemplateName,
          x: contextMenu.offsetX,
          y: contextMenu.offsetY,
        };
        const response = await addGroupFromTemplate(payload);
        resetContext();
        setImportTemplateId(null);
        setImportTemplateIdError(null);
        setImportTemplateName(null);
        setImportTemplateNameError(null);
        riskAssessmentData();
      } catch (error) {
        const responseErr = error.response?.data?.error;
        showDangerToaster(responseErr || `Faild to create group from template`);
        setIsServiceLoading(false);
      }
      setIsServiceLoading(false);
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
    setEditElement(activeObject);
    setIsServiceLoading(true);
    const riskObject = await getRiskObject(activeObject);
    if (riskObject.status === 200) {
      const { name, description } = riskObject.data.data;
      // (name, description);
      setObjectName(name);
      setObjectDescription(description);
      setContextMenu((prev) => ({ ...prev, type: "create object" }));
    }
    setIsServiceLoading(false);
  }, [activeObject]);

  const handleObjectAction = useCallback(
    async (element) => {
      // ("element", element);

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
        setIsServiceLoading(true);
        const response =
          element.operation === "enable"
            ? await updateRiskObjectPosition(window.data.id, element.id, {
                enabled: element.payload,
              })
            : await updateRiskObject(element.id, { status: element.payload });
        if (response.status < 200 || response.status >= 300) {
          showDangerToaster(`Update Faild`);
        }
        setIsServiceLoading(false);
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
        setIsServiceLoading(true);
        const response =
          element.operation === "enable"
            ? await updateNewDataObjectInstance(element.id, {
                disable: element.payload,
              })
            : await updateNewDataObjectInstance(element.id, {
                status: element.payload,
              });

        if (response.status < 200 || response.status >= 300) {
          showDangerToaster(`Update Faild`);
        }
        setIsServiceLoading(false);
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
    setIsServiceLoading(true);
    const response = await updateRiskObjectPosition(
      window.data.id,
      activeObject,
      {
        enabled: !elementEnable,
      }
    );
    if (response.status === 200) {
      setRiskObjects((prev) =>
        prev.map((object) => {
          if (object?.id === activeObject) {
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
            if (object?.id === activeObject) {
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
      setIsServiceLoading(false);
    }
  }, [window.data.id, activeObject, elementEnable, resetContext]);

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
        setSelectedConnection({ ...connection, type: connectionType });
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
    setIsServiceLoading(true);
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
    setIsServiceLoading(false);
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
      x: contextMenu.offsetX,
      y: contextMenu.offsetY,
      shared: true,
    };
    setIsServiceLoading(true);
    const response = await importGroup(payload);
    if (response.status >= 200 && response.status < 300) {
      resetContext();
      setImportGroupId(null);
      riskAssessmentData();
    } else {
      showDangerToaster(`Importing Shared Group Faild`);
    }
    setIsServiceLoading(false);
  }, [
    contextMenu.offsetX,
    contextMenu.offsetY,
    importGroupId,
    window.data.id,
    resetContext,
    riskAssessmentData,
  ]);

  const handleShareGroup = useCallback(async () => {
    setIsServiceLoading(true);
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
    setIsServiceLoading(false);
  }, [window.data.id, contextMenu.element, resetContext, riskAssessmentData]);

  const handleEditGroup = useCallback(async () => {
    setIsServiceLoading(true);
    const response = await updateRiskAssessmentGroup(
      activeObject,
      window.data.id,
      { name: groupName, description: groupDescription }
    );

    if (response.status === 201) {
      showSuccessToaster(`Con #${contextMenu.element} is Updated Successfully`);
      resetContext();
      riskAssessmentData();
    } else {
      showDangerToaster(
        `Error Updating Group #${contextMenu.element}: ${response.data.error}`
      );
    }
    setIsServiceLoading(false);
  }, [
    window.data.id,
    contextMenu.element,
    activeObject,
    resetContext,
    riskAssessmentData,
    groupDescription,
    groupName,
  ]);

  const handleModularGroup = useCallback(
    async (action) => {
      setIsServiceLoading(true);
      const response = await updateRiskAssessmentGroup(
        contextMenu.element,
        window.data.id,
        { modelGroup: 1 }
      );

      if (response.status === 201) {
        showSuccessToaster(
          `Group #${contextMenu.element} is updated Successfully`
        );
        resetContext();
        riskAssessmentData();
      } else {
        showDangerToaster(
          `Error setting Group #${contextMenu.element}: ${response.data.error}`
        );
      }
      setIsServiceLoading(false);
    },
    [window.data.id, contextMenu.element, resetContext, riskAssessmentData]
  );

  const fetchDataObjects = useCallback(async () => {
    const response = await getNewDataObjects();
    if (response.status === 200) {
      setGlobalDataObjects(response.data.data);
    } else {
      showDangerToaster(`Faild to get the Data Objects`);
    }
  }, []);

  const importDataObject = useCallback(async () => {
    setIsServiceLoading(true);
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
    payload.append("x", contextMenu.offsetX);
    payload.append("y", contextMenu.offsetY);
    payload.append("textType", importObjectText);
    payload.append("url", url);
    payload.append("fileCSV", importObjectFile);

    try {
      const response = await addNewDataObjectInstance(payload);
      if (response.status === 200) {
        resetContext();
        setImportObjectId(null);
        setImportObject(null);
        setImportObjectText(null);
        setImportObjectFile(null);
        riskAssessmentData();
      } else {
        showDangerToaster(`Error Adding Data Object`);
      }
    } catch (error) {
      showDangerToaster(`Error Adding Data Object`);
    }

    setIsServiceLoading(false);
  }, [
    contextMenu.offsetX,
    contextMenu.offsetY,
    importObjectId,
    importObjectText,
    importObjectFile,
    url,
    window.data.id,
    resetContext,
    riskAssessmentData,
  ]);

  const handleProperties = useCallback((id) => {
    // setContextMenu((prev) => ({ ...prev, element: id }));
    // setContextMenu({ element: id });
    setActiveObject(id);
  }, []);

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

  const attachFileToDO = useCallback(async () => {
    setIsServiceLoading(true);
    let payload = new FormData();
    payload.append("fileCSV", importObjectFile);
    payload.append("riskAssessmentId", window.data.id);
    const response = await updateNewDataObjectInstance(activeObject, payload);
    if (response.status >= 200 && response.status < 300) {
      riskAssessmentData();
      setImportObjectFile(null);
      resetContext();
    }
  }, [activeObject, importObjectFile, riskAssessmentData, resetContext]);

  const handleUnshareGroup = useCallback(async () => {
    try {
      const response = await unshareGroup({
        riskAssessmentId: window.data.id,
        riskGroupId: activeObject,
      });
      if (response.status >= 200 && response.status < 300) {
        setGroups((prev) => prev.filter((grp) => grp.id !== activeObject));
        resetContext();
      } else {
        showDangerToaster(`Error unsharing group`);
      }
    } catch (error) {
      showDangerToaster(`Error unsharing group: ${error}`);
    }
  }, [window.data.id, activeObject, resetContext]);

  const setForm = useCallback(
    ({ contextX, contextY, x, y, offsetX, offsetY }) => {
      setContextMenu(() => ({
        // ...prev,
        active: true,
        contextX,
        contextY,
        x,
        y,
        offsetX,
        offsetY,
        type: "group name",
      }));
    },
    []
  );

  useEffect(() => {
    if (!modularGroupAction) return;
    if (selectedElements.length !== 2) return;
    // if (
    //   !selectedElements.every(
    //     (obj) =>
    //       String(obj.description?.includes("input")) ||
    //       String(obj.description?.includes("output"))
    //   )
    // )
    //   return;
    if (!modularGroupAction && selectedElements.length !== 2) return;
    console.log(modularGroupAction);
    setContextMenu(() => ({
      // ...prev,
      active: true,
      contextX: modularGroupAction.contextX,
      contextY: modularGroupAction.contextY,
      x: modularGroupAction.x,
      y: modularGroupAction.y,
      offsetX: modularGroupAction.offsetX,
      offsetY: modularGroupAction.offsetY,
      type: "connection name",
    }));
  }, [modularGroupAction, selectedElements]);

  const connectionForm = useCallback(
    (e, target) => {
      // setActiveObject(target)
      console.log("connection");
      let { contextX, contextY, x, y, offsetX, offsetY } =
        getContextPosition(e);
      setModularGroupAction({ contextX, contextY, x, y, offsetX, offsetY });
      // handleContextMenu(e,target)
      // handleConnection({type:"connect"})
    },
    [getContextPosition, setModularGroupAction]
  );

  const updateConnection = useCallback(async () => {
    try {
      let connectionType = "riskObjects"; // default risk connections
      if (selectedElements.length === 2) {
        if (selectedConnection.type === "instances") {
          connectionType = "instances";
        } else if (selectedConnection.type === "instanceRiskObjects") {
          connectionType = "instanceRiskObjects";
        } else if (selectedConnection.type === "riskObjects") {
          connectionType = "riskObjects";
        } else {
          connectionType = "riskObjects";
        }
      }

      setIsServiceLoading(true);
      const response = await editRiskConnection(selectedConnection.id, {
        name: linkName,
        scalar: connectionWeight,
        text: connectionText,
        confidenceLevel,
        causeProperty,
        effectProperty,
        linkProperty,
        connectionType,
      });
      if (response.status >= 200 && response.status < 300) {
        setConnections((prev) =>
          prev.map((connection) => {
            if (connection.id === selectedConnection.id) {
              return {
                ...connection,
                name: linkName,
                scalar: connectionWeight,
                text: connectionText,
                confidenceLevel,
                causeProperty,
                effectProperty,
                linkProperty,
              };
            } else {
              return connection;
            }
          })
        );
        setLinkName(null);
        setConnectionText(null);
        setConnectionWeight(0);
        setConfidenceLevel(1);
        setCauseProperty(null);
        setEffectProperty(null);
        setLinkProperty(null);
        setSelectedConnection([]);
        resetContext();
        setIsServiceLoading(false);
        setSelectedElements([]);
      } else {
        showDangerToaster(`Error Updaating Connection`);
        setIsServiceLoading(false);
      }
    } catch (error) {
      showDangerToaster(`Error Updaating Connection: ${error}`);
      setIsServiceLoading(false);
    }
  }, [
    linkName,
    connectionText,
    connectionWeight,
    confidenceLevel,
    effectProperty,
    causeProperty,
    selectedConnection,
    resetContext,
    selectedElements.length,
    linkProperty,
  ]);

  const handleVOEdit = useCallback(async(id,data)=>{

    let processCase = false;
    let payload = new FormData();
    if(data.objectText){
      payload.append("text", data.objectText);
    }

    if(data.objectFont){
      payload.append("font", data.objectFont);
    }

    if(data.objectFile){
      payload.append("fileUpload", data.objectFile);
    }

    const response = await editVisualObject(id,payload);
    if (response.status >= 200 && response.status < 300) {
      setVisualObjects((prev) => prev.map(obj=>obj.id===data.id?response.data.data:obj));
      processCase = true;
    } else {
      showDangerToaster(`Can't Edit Object`);
    }

    setIsServiceLoading(false);
    return processCase;
  },[])

  const handleVODelete = useCallback(async(id)=>{
    let processCase =false;
    const response = await deleteVisualObject(id);
    if (response.status >= 200 && response.status < 300) {
      setVisualObjects((prev) => prev.filter(obj=>obj.id!==id));
      processCase = true;
    } else {
      showDangerToaster(`Can't Delete Object`);
    }

    setIsServiceLoading(false);
    return processCase;
  },[])

  const zIndexing = useCallback(async (type,action)=>{
    
    let currentIndex =10;
    let response;
    if(!hoveredElement) return
    if(hoveredElement.zIndex){
      currentIndex=hoveredElement.zIndex;
    }
    switch (action) {
      case "backward":
        currentIndex-=1;
        break;
        case "toBack":
          currentIndex=1;
        break;
        case "forward":
          currentIndex+=1;
        break;
        case "toFront":
          currentIndex=100;
        break;
    
      default:
        break;
    }
    switch (type) {
      case "ro":
         response = await updateRiskObjectPosition(window.data.id,hoveredElement.id,{zIndex:currentIndex});
        break;
        case "do":
         response = await updateNewDataObjectInstance(hoveredElement.id,{zIndex:currentIndex});
        break;
        case "vo":
         response = await editVisualObject(hoveredElement.id,{zIndex:currentIndex});
        break;

        case "co":
         response = await editAnalyticsChart(hoveredElement.id,{zIndex:currentIndex});
        break;
    
      default:
        
        break;
    }

    if(response.status>=200 && response.status <300){
      riskAssessmentData();
    }else{
      showDangerToaster(`Faild To Update`);
    }
  },[hoveredElement,riskAssessmentData,window.data.id])

  const handleRefresh = useCallback(()=>{
    riskAssessmentData();
  },[riskAssessmentData])

  const addScenario = useCallback(async (data)=>{

  });

  const addScenarioRun = useCallback(async (data)=>{

  });

  const applyScenario = useCallback(async (id)=>{

  });

  const applyScenarioRun = useCallback(async (id)=>{

  });

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
        title={`${window.data.id} - ${window.data.name}`}
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
        {dataLoaded && (
          <>
          <RiskAssessment
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          selectedScenarioRun={selectedScenarioRun}
          handleRefresh={handleRefresh}
          handleVOEdit={handleVOEdit}
          handleVODelete={handleVODelete}
            visualObjectEdit={visualObjectEdit}
            analyticsChartsFilter={analyticsChartsFilter}
            analyticsChartsDelete={analyticsChartsDelete}
            analyticsCharts={analyticsCharts}
            visualObjects={visualObjects}
            globalViewIndex={globalViewIndex}
            views={views}
            analysisPacks={analysisPacks}
            charts={charts}
            getAnalytics={getAnalytics}
            openedGroupConnections={openedGroupConnections}
            openedGroup={openedGroup}
            handleOpenedGroup={handleOpenedGroup}
            objects={riskObjects}
            groups={groups}
            metaDataList={metaDataList}
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
            addToGroup={addToGroup}
            checkFilter={checkFilter}
            checkConnctionVisibility={checkConnctionVisibility}
            setGroups={setGroups}
            handleUnshareGroup={handleUnshareGroup}
            connectionForm={connectionForm}
            logs={logs}
          />
          
          </>
        )}
      </Window>
      <Rnd
        position={{
          x: Number(contextMenu.contextX),
          y: Number(contextMenu.contextY),
        }}
        style={{ zIndex: 9999999 }}
        onDragStop={(e, d) => updateDraftLocation(e, d)}
        enableResizing={false}
      >
        {contextMenu.active && contextMenu.type === "context" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            {elementEnable ? menu : null}

            <MenuDivider />
            <MenuItem
              text="Backward"
              onClick={() =>{zIndexing("ro","backward")}
              }
            />
            <MenuItem
              text="Send To Back"
              onClick={() =>{zIndexing("ro","toBack")}
              }
            />
            <MenuItem
              text="Forward"
              onClick={() =>{zIndexing("ro","forward")}
              }
            />
            <MenuItem
              text="Send To Front"
              onClick={() =>{zIndexing("ro","toFront")}
              }
            />
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

        {contextMenu.active && contextMenu.type === "contextDO" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Attach"
              onClick={() =>
                setContextMenu((prev) => ({ ...prev, type: "uploadDO" }))
              }
            />
            <MenuDivider />
            <MenuItem
              text="Backward"
              onClick={() =>{zIndexing("do","backward")}
              }
            />
            <MenuItem
              text="Send To Back"
              onClick={() =>{zIndexing("do","toBack")}
              }
            />
            <MenuItem
              text="Forward"
              onClick={() =>{zIndexing("do","forward")}
              }
            />
            <MenuItem
              text="Send To Front"
              onClick={() =>{zIndexing("do","toFront")}
              }
            />
          </Menu>
        )}

{contextMenu.active && contextMenu.type === "contextCO" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Backward"
              onClick={() =>{zIndexing("co","backward")}
              }
            />
            <MenuItem
              text="Send To Back"
              onClick={() =>{zIndexing("co","toBack")}
              }
            />
            <MenuItem
              text="Forward"
              onClick={() =>{zIndexing("co","forward")}
              }
            />
            <MenuItem
              text="Send To Front"
              onClick={() =>{zIndexing("co","toFront")}
              }
            />
          </Menu>
        )}

{contextMenu.active && contextMenu.type === "visualObject" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Backward"
              onClick={() =>{zIndexing("vo","backward")}
              }
            />
            <MenuItem
              text="Send To Back"
              onClick={() =>{zIndexing("vo","toBack")}
              }
            />
            <MenuItem
              text="Forward"
              onClick={() =>{zIndexing("vo","forward")}
              }
            />
            <MenuItem
              text="Send To Front"
              onClick={() =>{zIndexing("vo","toFront")}
              }
            />
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "uploadDO" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>New Data Object Attachment</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                attachFileToDO();
              }}
            >
              <FormGroup
                label={`Attachment`}
                labelInfo="(required)"
                intent="primary"
                labelFor="Type"
              >
                <FileInput
                  style={{ zIndex: 9999999999999 }}
                  fill={true}
                  hasSelection={importObjectFile}
                  text={
                    importObjectFile?.name
                      ? importObjectFile?.name
                      : "Choose file..."
                  }
                  onInputChange={(e) => {
                    setImportObjectFile(e.target.files[0]);
                  }}
                ></FileInput>
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
                    setImportObjectFile(null);
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
                  Attach
                </Button>
              </div>
            </form>
          </div>
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
            <MenuItem
              onClick={() =>
                setContextMenu((prev) => ({ ...prev, type: "connection name" }))
              }
              disabled={selectedConnection ? false : true}
              text="Edit Connection"
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
            <MenuDivider />
            <MenuItem
              text="Edit Group"
              onClick={() => {
                setEditGroupFlag(true);
                setContextMenu((prev) => ({ ...prev, type: "group name" }));
                setSelectedGroup(groups.find((grp) => grp.id === activeObject));
              }}
            />
            <MenuDivider />
            <MenuItem
              text={
                groups.find(
                  (grp) =>
                    grp.id === activeObject && grp.dataObjects.length === 0
                )?.modelGroup
                  ? "Normal Group"
                  : "Modular Group"
              }
              disabled={
                !groups
                  .find(
                    (grp) =>
                      grp.id === activeObject && grp.dataObjects.length === 0
                  )
                  ?.elements.every((element) => element.type === "model")
              }
              onClick={() =>
                handleModularGroup(
                  groups.find(
                    (grp) =>
                      grp.id === activeObject && grp.dataObjects.length === 0
                  )?.modelGroup
                )
              }
            />

            {groups.find(
              (grp) => grp.id === activeObject && grp.shared && !grp.mainShared
            ) ? (
              <MenuItem text="Unshare" onClick={handleUnshareGroup} />
            ) : null}
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
            <MenuItem text={`Views: ${views[globalViewIndex]}`}>
              {views.map((view, index) => (
                <MenuItem
                  key={view}
                  text={view}
                  onClick={() => {
                    setGlobalViewIndex(index);
                    resetContext();
                  }}
                />
              ))}
            </MenuItem>

            <MenuItem
              text="Show Filters"
              onClick={() =>
                setContextMenu((prev) => ({ ...prev, type: "show filters" }))
              }
            >
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
            <MenuItem
              text="Show All Analytics Charts"
              disabled={analyticsCharts.length === 0}
              onClick={() => {
                analyticsChartsFilter("all", {
                  x: contextMenu.offsetX,
                  y: contextMenu.offsetY,
                });
                resetContext();
              }}
            >
              {/* {analyticsCharts.map((chart) => (
                <MenuItem
                  active={chart?.visible}
                  key={`${chart.id}-${chart.name}`}
                  text={chart.name}
                  shouldDismissPopover={false}
                  onClick={() =>
                    analyticsChartsFilter(chart.id, {
                      x: contextMenu.offsetX,
                      y: contextMenu.offsetY,
                    })
                  }
                />
              ))} */}
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
              text="Create Visual Object"
              onClick={() => {
                setContextMenu((prev) => ({
                  ...prev,
                  type: "create visual object",
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
              text={
                globalViewIndex === 3 ? "Show Open Faces" : "Show Closed Faces"
              }
              onClick={() => {
                setGlobalViewIndex(globalViewIndex === 3 ? 2 : 3);
                setContextMenu((prev) => ({
                  ...prev,
                  type: null,
                }));
              }}
            />
          </Menu>
        )}

        {contextMenu.active && contextMenu.type === "create visual object" && (
          <div
            key="text3"
            style={{
              backgroundColor: "#30404D",
              color: "white",
              padding: "10px",
              borderRadius: "2px",
            }}
          >
            <H5 style={{ color: "white" }}>New Visual Object</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVisualObjectCreation();
              }}
            >
              <FormGroup label="Name" labelFor="von">
                <InputGroup
                  id="von"
                  onChange={(event) => {
                    setVoName(event.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup label="Text" labelFor="vot">
                <TextArea
                  fill={true}
                  id="vot"
                  onChange={(event) => {
                    setVoText(event.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup label={`Image`} labelFor="imvo">
                <FileInput
                  fill={true}
                  hasSelection={voFilePath}
                  text={voFilePath?.name ? voFilePath?.name : "Choose file..."}
                  onInputChange={(e) => {
                    setVoFilePath(e.target.files[0]);
                  }}
                ></FileInput>
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
            <H5 style={{ color: "white" }}>Group Info</H5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGrouping({ type: "group" });
              }}
            >
              <FormGroup
                label="Name"
                // labelInfo="(required)"
                intent={groupNameError ? Intent.DANGER : Intent.NONE}
                helperText={groupNameError}
                labelFor="newGroupName"
              >
                <InputGroup
                  // required
                  id="newGroupName"
                  onChange={(event) => {
                    setGroupNameError(null);
                    setGroupName(event.target.value);
                  }}
                  defaultValue={selectedGroup.name ? selectedGroup.name : ""}
                />
              </FormGroup>
              <FormGroup
                label="Description"
                // labelInfo="(required)"
                // intent={groupNameError ? Intent.DANGER : Intent.NONE}
                // helperText={groupNameError}
                labelFor="newGroupDescription"
              >
                {/* <InputGroup
                  // required
                  id="newGroupDescription"
                  onChange={(event) => {
                    // setGroupNameError(null);
                    setGroupDescription(event.target.value);
                  }}
                  defaultValue={
                    selectedGroup.description ? selectedGroup.description : ""
                  }
                /> */}
                <TextArea
                  className="panningDisabled pinchDisabled wheelDisabled"
                  fill={true}
                  id="newGroupDescription"
                  onChange={(event) => {
                    // setGroupNameError(null);
                    setGroupDescription(event.target.value);
                  }}
                  defaultValue={
                    selectedGroup.description ? selectedGroup.description : ""
                  }
                ></TextArea>
              </FormGroup>
              <Checkbox
                disabled={
                  !selectedElements.every((element) => element.type === "model")
                }
                onChange={() => setModularGroup((prev) => !prev)}
                checked={selectedGroup.modelGroup | false}
              >
                Model <strong>Group</strong>
              </Checkbox>
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
                    setModularGroup(false);
                    resetContext();
                    setSelectedGroup({});
                    setEditGroupFlag(false);
                  }}
                >
                  Cancel
                </Button>
                {editGroupFlag ? (
                  <Button
                    // type="submit"
                    loading={isServiceLoading}
                    intent={Intent.WARNING}
                    onClick={handleEditGroup}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={isServiceLoading}
                    intent={Intent.SUCCESS}
                  >
                    Add
                  </Button>
                )}
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
            <H5 style={{ color: "white" }}>New Connection</H5>
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
                  // required
                  id="newLinkName"
                  defaultValue={linkName}
                  onChange={(event) => {
                    setLinkNameError(null);
                    setLinkName(null);
                    setLinkName(event.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Weight"
                labelInfo="(required)"
                intent={linkNameError ? Intent.DANGER : Intent.NONE}
                helperText={linkNameError}
                labelFor="newLinkWeight"
              >
                <NumericInput
                  // required
                  max={5}
                  min={-5}
                  value={connectionWeight}
                  id="newLinkWeight"
                  onValueChange={(e) => {
                    setConnectionWeight(e);
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Confidence Level"
                labelInfo="(required)"
                intent={linkNameError ? Intent.DANGER : Intent.NONE}
                helperText={linkNameError}
                labelFor="newconfidenceLevel"
              >
                <NumericInput
                  // required
                  max={5}
                  min={1}
                  value={confidenceLevel}
                  id="newconfidenceLevel"
                  onValueChange={(e) => {
                    setConfidenceLevel(e);
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Cause"
                labelInfo="(required)"
                intent={linkNameError ? Intent.DANGER : Intent.NONE}
                helperText={linkNameError}
                labelFor="cause"
              >
                <HTMLSelect
                  id="cause"
                  defaultValue={causeProperty}
                  onChange={(e) => setCauseProperty(e.target.value)}
                >
                  <option selected disabled>
                    Select MDL1/MDL2 Identifier
                  </option>
                  {metaDataList ? (
                    metaDataList.map((data) => {
                      const mainLevel = [
                        <option disabled>MDL1 - {data.name}</option>,
                        ...data.metaDataLevel2s.map((l2) => (
                          <option
                            selected={
                              selectedConnection?.causeProperty === l2.id
                            }
                            value={l2.id}
                          >
                            {l2.name}
                          </option>
                        )),
                      ];
                      return mainLevel;
                    })
                  ) : (
                    <option>Loading Data</option>
                  )}
                </HTMLSelect>
              </FormGroup>

              <FormGroup
                label="Effect"
                labelInfo="(required)"
                intent={linkNameError ? Intent.DANGER : Intent.NONE}
                helperText={linkNameError}
                labelFor="effect"
              >
                <HTMLSelect
                  id="effect"
                  defaultValue={effectProperty}
                  onChange={(e) => setEffectProperty(e.target.value)}
                >
                  <option selected disabled>
                    Select MDL1/MDL2 Identifier
                  </option>
                  {metaDataList ? (
                    metaDataList.map((data) => {
                      const mainLevel = [
                        <option disabled>MDL1 - {data.name}</option>,
                        ...data.metaDataLevel2s.map((l2) => (
                          <option
                            selected={
                              selectedConnection?.effectProperty === l2.id
                            }
                            value={l2.id}
                          >
                            {l2.name}
                          </option>
                        )),
                      ];
                      return mainLevel;
                    })
                  ) : (
                    <option>Loading Data</option>
                  )}
                </HTMLSelect>
              </FormGroup>
              <FormGroup
                label="Text"
                labelInfo="(required)"
                // intent={linkNameError ? Intent.DANGER : Intent.NONE}
                // helperText={linkNameError}
                labelFor="newconnectionText"
              >
                <HTMLSelect onChange={(e) => setConnectionText(e.target.value)}>
                  <option selected disabled>
                    Select Type
                  </option>
                  <option
                    selected={selectedConnection?.text === "or"}
                    value="or"
                  >
                    OR
                  </option>
                  <option
                    selected={selectedConnection?.text === "and"}
                    value="and"
                  >
                    AND
                  </option>
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
                    setLinkNameError(null);
                    setLinkName(null);
                    setConnectionWeight(0);
                    setConfidenceLevel(1);
                    setModularGroupAction(null);
                    resetContext();
                  }}
                >
                  Cancel
                </Button>

                {selectedConnection ? (
                  <>
                    <Button
                      onClick={updateConnection}
                      loading={isServiceLoading}
                      intent={Intent.WARNING}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={handleDisconnect}
                      loading={isServiceLoading}
                      intent={Intent.DANGER}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    loading={isServiceLoading}
                    intent={Intent.SUCCESS}
                  >
                    Add
                  </Button>
                )}
              </div>
              <FormGroup
                label="Link Property"
                labelInfo="(required)"
                intent={linkNameError ? Intent.DANGER : Intent.NONE}
                helperText={linkNameError}
                labelFor="LinkProperty"
              >
                <HTMLSelect
                  id="LinkProperty"
                  defaultValue={linkProperty}
                  onChange={(e) => setLinkProperty(e.target.value)}
                >
                  <option selected disabled>
                    Select MDL1/MDL2 Identifier
                  </option>
                  {linkProperties[0]?.metaDataLevel2 ? (
                    linkProperties[0].metaDataLevel2.map((data) => {
                      const mainLevel = [
                        <option disabled>MDL1 - {data.name}</option>,
                        ...data.dataObjects[0].children.map((l2) => (
                          <option
                            selected={
                              selectedConnection?.linkProperty === l2.id
                            }
                            value={l2.id}
                          >
                            {l2.name}
                          </option>
                        )),
                      ];
                      return mainLevel;
                    })
                  ) : (
                    <option>Loading Data</option>
                  )}
                </HTMLSelect>
              </FormGroup>
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
                  required
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
