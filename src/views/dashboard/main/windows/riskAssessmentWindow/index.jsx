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
  TextArea
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
  const [riskObjects, setRiskObjects] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [connections, setConnections] = useState([]);
  const [groups, setGroups] = useState([]);
  const [importTemplateId, setImportTemplateId] = useState(null);
  const [importTemplateName, setImportTemplateName] = useState(null);
  const [importTemplateNameError, setImportTemplateNameError] = useState(null);
  const [importTemplateIdError, setImportTemplateIdError] = useState(null);
  const [templates, setTemplates] = useState([]);

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
          contextX: 0,
          contextY: 0,
          element: null,
        });
        const response = await addRiskConnection(payload);
        // riskAssessmentData();
        setConnections((prev) => [...prev, response.data.data]);
        setSelectedElements([]);
        setSelectedObjects([]);
        console.log(payload);
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
    async (e, data) => {
      e.preventDefault();
      if (data) {
        if (data["position.enabled"]) {
          setElementEnable(true);
        } else {
          setElementEnable(false);
        }
      }

      console.log("rx", e, data);
      let type, id;
      const rect = document
        .querySelector("#mainContainer")
        .getBoundingClientRect();
      const scrollDiv = document.querySelector("#mainContainer");
      console.log("scroll", scrollDiv.scrollTop);
      const contextX = e.pageX - rect.left;
      const contextY = e.pageY - rect.top + scrollDiv.scrollTop;
      let x = e.nativeEvent.layerX;
      let y = e.nativeEvent.layerY;
      if (e.target.id === "svg" || e.target.nodeName === "rect") {
        type = "create";
        // x = e.nativeEvent.layerX+ 20;
        // y = e.nativeEvent.layerY + 50;
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
        x,
        y,
        contextX,
        contextY,
        element: id ? Number(id) : Number(e.target.parentElement.id),
      }));
    },
    [setContextMenu, selectedElements]
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
          contextX: 0,
          contextY: 0,
          element: null,
        });
        setSelectedElements([]);
        setSelectedObjects([]);
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
  }, []);

  const addRiskObject = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsServiceLoading(true);
        const payload = {
          type: objectType.toLowerCase(),
          name: objectName,
          description: objectDescription,
          x: contextMenu.x,
          y: contextMenu.y,
          riskAssessmentId: window.data.id,
          enabled: true,
        };

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
          resetContext={resetContext}
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

            {elementEnable ? (
              <>
                <MenuDivider />
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
                fetchTemplates();
                setContextMenu((prev) => ({
                  ...prev,
                  type: "import template",
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
              <FormGroup
                label="Description"
                labelInfo="(required)"
                intent={objectDescriptionError ? Intent.DANGER : Intent.NONE}
                helperText={objectDescriptionError}
                labelFor="newObjectDescription"
              >
                <TextArea
                  required
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
      </div>
    </>
  );
};
