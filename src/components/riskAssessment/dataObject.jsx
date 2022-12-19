import { useCallback, useState } from "react";
import {
  Button,
  TextArea,
  H5,
  HTMLSelect,
  FormGroup,
  FileInput,
} from "@blueprintjs/core";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Rnd } from "react-rnd";
import {
  updateNewDataObjectInstance,
  updateNewDataObjectInstanceNew,
} from "../../services";
import { size } from "lodash";
import { Classes, Popover2 } from "@blueprintjs/popover2";
export const DataObject = ({
  riskAssessmentId,
  data,
  scale,
  elementSelection,
  selectedElements,
  setFirstContext,
  setHoveredElement,
  handleObjectAction,
  expanded,
  expandPosition,
  groupId,
  removeFromGroup,
  enviroDimension,
  addToGroup,
  groups,
  handleContextMenu,
  shared
}) => {
  const [importObjectFile, setImportObjectFile] = useState(null);
  const [size, setSize] = useState({ w: data.width, h: data.height });
  const [viewedAttribute, setViewedAttribute] = useState(data.textType);
  const [usingService, setUsingService] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [editGrp, setEditGrp] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const updateXarrow = useXarrow();
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
  });
  const updateSize = useCallback(
    async (delta, direction, position) => {
      // (data,delta,position);
      const w = Math.round(size.w + delta.width);
      const h = Math.round(size.h + delta.height);
      setSize({ w, h });
      setDrag((prev) => ({ ...prev, cy: position.y, cx: position.x }));
      if (position.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        position.x = 0;
      }

      if (position.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        position.y = 0;
      }
      updateXarrow();
      const updateOjectPosition = await updateNewDataObjectInstanceNew(
        riskAssessmentId,
        data.id,
        {
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: w,
          height: h,
          enabled: data["position.enabled"],
        }
      );
      // const updateOjectPosition = await updateNewDataObjectInstance(data.id, {
      //   x: Math.round(position.x),
      //   y: Math.round(position.y),
      //   width: w,
      //   height: h,
      //   enabled: data["position.enabled"],
      // });
    },
    [data, updateXarrow, size]
  );

  const handleGroup = useCallback(async () => {
    if (groupId) {
      setEditGroup(true);
    }
  }, [groupId]);

  const resetFace = useCallback(() => {
    setEdit(false);
    setEditingValue(null);
  }, []);

  const updateRiskObject = useCallback(async () => {
    setUsingService(true);
    let payload;
    payload = { textType: editingValue };

    const response = await updateNewDataObjectInstance(data.id, payload);
    if (response.status === 200) {
      setViewedAttribute(editingValue);
      resetFace();
    }
    setUsingService(false);
  }, [editingValue, data.id, resetFace]);

  const updateLocation = useCallback(
    async (e, d) => {
      setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
      if (d.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        d.x = 0;
      }

      if (d.x > enviroDimension.width - 200) {
        setDrag((prev) => ({ ...prev, cx: enviroDimension.width - 200 }));
        d.x = enviroDimension.width - 200;
      }

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }

      if (d.y > enviroDimension.height - 200) {
        setDrag((prev) => ({ ...prev, cy: enviroDimension.height - 200 }));
        d.y = enviroDimension.height - 200;
      }
      updateXarrow();
      const updateOjectPosition = await updateNewDataObjectInstanceNew(
        riskAssessmentId,
        data.id,
        {
          x: Math.round(d.x),
          y: Math.round(d.y),
          enabled: data["position.enabled"],
        }
      );
    },
    [data, updateXarrow, enviroDimension, riskAssessmentId]
  );

  const handleClick = useCallback(
    (e) => {
      
     if(e.target.className!=="bp3-file-upload-input"){
      if(e.target.localName!=="a") e.preventDefault();
      if (e.detail !== 2) return;
      if (data.disable) return;
      elementSelection(
        data,
        selectedElements.find(
          (element) => element.id === data.id && element.type === data.type
        )
          ? false
          : true
      );
     }
     
    },
    [elementSelection, data, selectedElements]
  );

  const removeFromGroupHandler = useCallback(async () => {
    const response = await removeFromGroup("data", { id: data.id, groupId });
  }, [data.id, groupId, removeFromGroup]);

  const handleAddToGroup = useCallback(async () => {
    setUsingService(true);
    const response = await addToGroup("data", {
      ...data,
      groupId: editingValue,
    });
    setUsingService(false);
    if (response !== "done") {
    }
  }, [addToGroup, data, editingValue]);

  return (
    <Rnd
      id={`D-${riskAssessmentId}-${data.id}`}
      key={`D-${riskAssessmentId}-${data.id}`}
      // disableDragging={data.disable}
      enableResizing={!data.disable}
      default={{
        x: expanded ? drag.cx : expandPosition.x,
        y: expanded ? drag.cy : expandPosition.y,
        width: expanded ? size.w : 150,
        height: expanded ? size.h : 150,
      }}
      position={{
        x: expanded ? drag.cx : expandPosition.x,
        y: expanded ? drag.cy : expandPosition.y,
      }}
      size={{
        width: expanded ? size.w : 150,
        height: expanded ? size.h : 150,
      }}
      minWidth={50}
      minHeight={50}
      bounds="window"
      onDrag={updateXarrow}
      onResize={updateXarrow}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateSize(delta, direction, position);
      }}
      scale={scale}
      onDragStop={(e, d) => updateLocation(e, d)}
    >
      {expanded ? (
        <div
          onMouseLeave={() => {
            setFirstContext("main");
            setHoveredElement(null);
          }}
          onMouseEnter={() => {
            setFirstContext("DO");
            setHoveredElement(data);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setFirstContext("DO");
            setHoveredElement(data);
            handleContextMenu(e, data);
          }}
          // title={data.description}
          onClick={handleClick}
          className="panningDisabled pinchDisabled wheelDisabled"
          style={{
            height: "100%",
            border: selectedElements.find((element) => element.id === data.id)
              ? "5px solid #EE0000"
              : !data.disable
              ? "5px solid #1D7324"
              : "5px solid grey",
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "5px",
            display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
          }}
        >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="panningDisabled pinchDisabled wheelDisabled"
            >
              <Button
                className="panningDisabled pinchDisabled wheelDisabled"
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.id}
              </Button>
              <Button
                className="panningDisabled pinchDisabled wheelDisabled"
                title={data.dataObjectNew.description}
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.dataObjectNew.name}
              </Button>
              <Button
                className="panningDisabled pinchDisabled wheelDisabled"
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.dataObjectNew.chronType}
              </Button>
              <Button
                className="panningDisabled pinchDisabled wheelDisabled"
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.dataObjectNew.IOtype}
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "5px",
              }}
              className="panningDisabled pinchDisabled wheelDisabled"
            >
              <Button
              disabled={shared}
                small={true}
                intent={!data.disable ? "warning" : "primary"}
                onClick={() =>
                  handleObjectAction({
                    id: data.id,
                    type: "instance",
                    operation: "enable",
                    payload: !data.disable,
                    groupId,
                  })
                }
                className="panningDisabled pinchDisabled wheelDisabled"
              >
                {!data.disable ? "Disable" : "Enable"}
              </Button>
              <Button
                disabled={shared || data.disable}
                small={true}
                className="panningDisabled pinchDisabled wheelDisabled"
                intent={data.status === "invisible" ? "primary" : "warning"}
                title={
                  data.status === "invisible"
                    ? "Make Visible"
                    : "Make Invisible"
                }
                icon={data.status === "invisible" ? "eye-on" : "eye-off"}
                onClick={() => {
                  handleObjectAction({
                    id: data.id,
                    type: "instance",
                    operation:
                      data.status === "invisible" ? "changed" : "invisible",
                    payload:
                      data.status === "invisible" ? "changed" : "invisible",
                    object: data,
                    groupId,
                  });
                  setFirstContext("main");
                }}
              ></Button>
              {editGroup ? (
                <>
                  <Button
                    // fill={true}
                    // disabled={!activeAttribute}
                    className="panningDisabled pinchDisabled wheelDisabled"
                    title={`Remove from G#${Number(groupId - 2000000)}`}
                    intent="warning"
                    small={true}
                    icon="graph-remove"
                    onClick={removeFromGroupHandler}
                    loading={usingService}
                  ></Button>
                  <Button
                    // fill={true}
                    // disabled={!activeAttribute}
                    className="panningDisabled pinchDisabled wheelDisabled"
                    title="Cancel"
                    intent="danger"
                    small={true}
                    icon="cross"
                    onClick={() => setEditGroup(false)}
                    loading={usingService}
                  ></Button>
                </>
              ) : groupId ? (
                <Button
                  disabled={shared || data.disable}
                  small={true}
                  onClick={() => {
                    setEditGroup(true);
                  }}
                  intent={!data.disable ? "primary" : "none"}
                >
                  {groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
                </Button>
              ) : (
                <Popover2
                  usePortal={false}
                  popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                  boundary={"scrollParent"}
                  enforceFocus={false}
                  isOpen={editGrp}
                  content={
                    <div className="bp4-popover2-content">
                      <div key="text">
                        <H5>Add To Group</H5>
                        <span></span>
                        <FormGroup
                          label="Select Group"
                          labelInfo="(required)"
                          labelFor="grp"
                        >
                          <HTMLSelect
                            required
                            value={editingValue}
                            fill={true}
                            id="Text"
                            onChange={(event) => {
                              setEditingValue(event.target.value);
                            }}
                          >
                            <option selected disabled>
                              Select Group
                            </option>
                            {groups.map((grp) => (
                              <option value={grp.id}>{grp.name}</option>
                            ))}
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
                            className="bp4-button bp4-intent-danger bp4-popover2-dismiss"
                            style={{ marginRight: 10 }}
                            onClick={() => {
                              setEditGrp(false);
                              setEditingValue(null);
                            }}
                            loading={usingService}
                          >
                            Cancel
                          </Button>
                          <Button
                            intent="primary"
                            className="bp4-button bp4-popover2-dismiss"
                            onClick={handleAddToGroup}
                            loading={usingService}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Button
                    disabled={data.disable}
                    small={true}
                    onClick={() => {
                      setEditGrp(true);
                    }}
                    intent={!data.disable ? "primary" : "none"}
                  >
                    G
                  </Button>
                </Popover2>
              )}
              {!edit ? (
                <Button
                  // fill={true}
                  className="panningDisabled pinchDisabled wheelDisabled"
                  disabled={shared || data.disable}
                  title="Edit"
                  intent="primary"
                  small={true}
                  icon="edit"
                  onClick={() => {
                    setEdit(true);
                    setEditingValue(viewedAttribute);
                  }}
                ></Button>
              ) : (
                <>
                  <Button
                    // fill={true}
                    // disabled={!activeAttribute}
                    className="panningDisabled pinchDisabled wheelDisabled"
                    title="Save"
                    intent="success"
                    small={true}
                    icon="confirm"
                    onClick={updateRiskObject}
                    loading={usingService}
                  ></Button>
                  <Button
                    // fill={true}
                    // disabled={!activeAttribute}
                    className="panningDisabled pinchDisabled wheelDisabled"
                    title="Cancel"
                    intent="danger"
                    small={true}
                    icon="cross"
                    onClick={resetFace}
                    loading={usingService}
                  ></Button>
                </>
              )}
              <Button
                disabled={shared || data.disable}
                small={true}
                className="panningDisabled pinchDisabled wheelDisabled"
                intent={data.status === "delete" ? "warning" : "danger"}
                onClick={() => {
                  handleObjectAction({
                    id: data.id,
                    type: "instance",
                    operation: data.status === "delete" ? "changed" : "delete",
                    payload: data.status === "delete" ? "changed" : "delete",
                    object: data,
                    groupId,
                  });
                  setFirstContext("main");
                }}
              >
                Delete
              </Button>
            </div>

          {data.dataObjectNew.arrayName ? (
            // <></>
            <table
              className="bp4-html-table-bordered panningDisabled"
              style={{ textAlign: "left", paddingTop: "5px" }}
            >
              <tr>
                <th>Array Name</th>
                <td>{data.dataObjectNew.arrayName}</td>
              </tr>
              <tr>
                <th>Array Description</th>
                <td>{data.dataObjectNew.arrayDescription}</td>
              </tr>
              <tr>
                <th>Array Dimension</th>
                <td>
                  {data.dataObjectNew.array.length &&
                    `${data.dataObjectNew?.array?.length} X ${data.dataObjectNew?.array[0].length}`}
                </td>
              </tr>
            </table>
          ) : (
            <div
              className="panningDisabled pinchDisabled wheelDisabled"
              style={{
                paddingTop: "10px",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                
              }}
            >
              {edit ? (
                <>
                  <TextArea
                    className="panningDisabled pinchDisabled wheelDisabled"
                    fill={true}
                    // growVertically={true}
                    onChange={(e) => setEditingValue(e.target.value)}
                    value={editingValue}
                  ></TextArea>
                </>
              ) : (
                <>
                {data.filePath ? <a
                  className="panningDisabled pinchDisabled wheelDisabled"
                  style={{ overflow: "auto", height: "100%" }}
                  href={data.filePath}
                  target
                >
                  {data.filePath.split("/")[data.filePath.split("/").length-1]}
                </a>:"No Attachment"}
                <br />
                <div overflow="auto"
                  className="panningDisabled pinchDisabled wheelDisabled"
                  style={{ overflow: "auto", height: "100%",borderTop:"2px solid grey" }}
                >
                  {viewedAttribute}
                </div>
                </>
              )}
            </div>
          )}
          {/* <hr width="100%" color="grey" size="1"/>
        <H3 style={{textAlign:"center"}}>Refrenced Objects</H3>
        <table>
            <tr><th>Risk Assessment</th><td>RA1</td></tr>
            <tr><th>Name</th><td>Array1</td></tr>
            <tr><th>Array</th><td>V1,v2,v3,v4,v5</td></tr>
            <tr><th>Description</th><td>Array Dummy Description</td></tr>
        </table>
        <hr width="100%" color="grey" size="1"/> */}
        </div>
      ) : null}
    </Rnd>
  );
};
