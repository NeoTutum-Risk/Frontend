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
  addRiskTemplate
} from "../../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
} from "../../../../../utils/toaster";
import { Window } from "../window";
import { RiskAssessment } from "../../../../../components/riskAssessment";
export const RiskAssessmentWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [groupName, setGroupName] = useState(null);
  const [groupNameError, setGroupNameError] = useState(null);
  const [templateName, setTemplateName] = useState(null);
  const [templateNameError, setTemplateNameError] = useState(null);
  const [linkName, setLinkName] = useState(null);
  const [linkNameError, setLinkNameError] = useState(null);
  const [objectType, setObjectType] = useState(null);
  const [objectNameError, setObjectNameError] = useState(null);
  const [objectName, setObjectName] = useState(null);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    active: false,
    type: "",
    x: 0,
    y: 0,
    element: null,
  });
  const [riskObjects, setRiskObjects] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [connections, setConnections] = useState([]);
  const [groups, setGroups] = useState([]);

  const riskAssessmentData = useCallback(async () => {
    const response = await getRiskAssessment(window.data.id);
    if (response.status === 200) {
      console.log(response.data.data);
      setRiskObjects(response.data.data.riskObjects);
      setMetaData(response.data.data.metaData.referenceGroupJsons[0].json);
      setGroups(response.data.data.riskGroups);
      setConnections(response.data.data.riskConnections);
    } else {
      showDangerToaster(`Error Retrieving Risk Assessment Data`);
    }
  }, [window.data.id]);

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
            element: null,
          });
        } else {
          setContextMenu({
            active: false,
            type: "",
            x: 0,
            y: 0,
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
          element: null,
        });
      }
    },
    [contextMenu.element]
  );

  const handleConnection = useCallback(
    async (data) => {
      if (data.type === "connect") {
        let payload = {
          sourceRef: selectedElements[0].id,
          targetRef: selectedElements[1].id,
          riskAssessmentId: window.data.id,
          name: linkName,
        };
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          element: null,
        });
        const response = await addRiskConnection(payload);
        // riskAssessmentData();
        setConnections((prev) => [...prev, response.data.data]);
        setSelectedElements([]);
        console.log(payload);
      }
    },
    [window.data.id, selectedElements, setConnections, linkName]
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
          console.log(l2);
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

  const handleContextMenu = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(e);
      let type, id;
      if (e.target.id === "svg") {
        type = "create";
      } else if (e.target.id.split("-").length === 2) {
        type = "template";
        id = e.target.id.split("-")[1];
      } else {
        if (selectedElements.length === 0) {
          type = "context";
        } else if (selectedElements.length === 2) {
          type = "connection";
        } else if (selectedElements.length > 2) {
          type = "grouping";
        } else {
          type = "object";
        }
      }

      setContextMenu((prev) => ({
        active: true,
        type,
        x: e.nativeEvent.layerX + 20,
        y: e.nativeEvent.layerY + 50,
        element: id ? Number(id) : Number(e.target.parentElement.id),
      }));
    },
    [setContextMenu, selectedElements]
  );

  const handleRiskViewContext = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(e);
      if (!contextMenu.active) {
        setContextMenu((prev) => ({
          active: true,
          type: "create",
          x: e.nativeEvent.layerX + 20,
          y: e.nativeEvent.layerY + 50,
          element: Number(e.target.parentElement.id),
        }));
      }
    },
    [contextMenu.active]
  );
  const addNewTemplate = useCallback(
    async () => {

        const payload = {
          riskGroupId : contextMenu.element,
          name: templateName,
        };

        const response = await addRiskTemplate(payload);
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          element: null,
        });
        setTimeout(riskAssessmentData, 100);
        // const redraw = await riskAssessmentData();

    },
    [
      riskAssessmentData,
      contextMenu,
      templateName,
    ]
  );

  const handleGrouping = useCallback(
    async (data) => {
      if (data.type === "group") {
        const payload = {
          riskAssessmentId: window.data.id,
          riskObjects: selectedElements.map((object) => object.id),
          x: Number(contextMenu.x + 15),
          y: Number(contextMenu.y + 15),
          name: groupName,
        };

        const response = await addRiskAssessmentGroup(payload);
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          element: null,
        });
        setSelectedElements([]);
        setTimeout(riskAssessmentData, 100);
        // const redraw = await riskAssessmentData();
      }
    },
    [
      riskAssessmentData,
      window.data.id,
      selectedElements,
      contextMenu,
      groupName,
    ]
  );

  const resetContext = useCallback(() => {
    setContextMenu({
      active: false,
      type: "",
      x: 0,
      y: 0,
      element: null,
    });
  }, []);

  const addRiskObject = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsServiceLoading(true);
        const payload = {
          type: objectType.toLowerCase(),
          name: objectName,
          x: contextMenu.x,
          y: contextMenu.y,
          riskAssessmentId: window.data.id,
        };

        const response = await addNewRiskObject(payload);
        setIsServiceLoading(false);
        resetContext();
        setObjectName(null);
        setObjectType(null);
      } catch (er) {
        setIsServiceLoading(false);
        showDangerToaster(`Unable to Create Risk Object ${er}`);
        resetContext();
        setObjectName(null);
        setObjectType(null);
      }
    },
    [contextMenu, window.data.id, objectName, objectType, resetContext]
  );
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
        {contextMenu.active && contextMenu.type === "loading" && (
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
          riskAssessmentId={window.data.id}
          handleContextMenu={handleContextMenu}
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          connections={connections}
          // onContext={handleRiskViewContext}
        />
      </Window>
      <div
        className=""
        style={{
          zIndex: 10000000000,
          fontSize: "10px",
          position: "absolute",
          top: contextMenu.y,
          left: contextMenu.x,
        }}
      >
        {contextMenu.active && contextMenu.type === "context" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>{menu}</Menu>
        )}

        {contextMenu.active && contextMenu.type === "connection" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>
            <MenuItem
              text="Connect"
              onClick={() => {
                setContextMenu((prev) => ({
                  ...prev,
                  type: "connection name",
                }));
              }}
            />
            <MenuItem disabled text="Disconnect" />
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
                setObjectType("Model");
                setContextMenu((prev) => ({
                  ...prev,
                  type: "create object",
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
            <H5 style={{ color: "white" }}>Add New {objectType} Object</H5>
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
                  onChange={(event) => {
                    setObjectNameError(null);
                    setObjectName(event.target.value);
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
