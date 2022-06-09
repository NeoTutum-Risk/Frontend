import { useCallback, useState } from "react";
import { Button, TextArea, H3 } from "@blueprintjs/core";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Rnd } from "react-rnd";
import { updateNewDataObjectInstance } from "../../services";
import { size } from "lodash";
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
}) => {
  const [size, setSize] = useState({ w: data.width, h: data.height });
  const [viewedAttribute, setViewedAttribute] = useState(data.textType);
  const [usingService, setUsingService] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [editGroup, setEditGroup] = useState(false);
  const updateXarrow = useXarrow();
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
  });
  const updateSize = useCallback(
    async (delta, direction, position) => {
      // console.log(data,delta,position);
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
      const updateOjectPosition = await updateNewDataObjectInstance(data.id, {
        x: Math.round(position.x),
        y: Math.round(position.y),
        width: w,
        height: h,
        enabled: data["position.enabled"],
      });
    },
    [data, updateXarrow]
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

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }
      updateXarrow();
      const updateOjectPosition = await updateNewDataObjectInstance(data.id, {
        x: Math.round(d.x),
        y: Math.round(d.y),
        enabled: data["position.enabled"],
      });
    },
    [data, updateXarrow]
  );

  const handleClick = useCallback(
    (e) => {
      console.log(e);
      e.preventDefault();
      if (e.detail !== 2) return;
      if (data.disable) return;
      console.log("Selecting ....");
      elementSelection(
        data,
        selectedElements.find(
          (element) => element.id === data.id && element.type === data.type
        )
          ? false
          : true
      );
    },
    [elementSelection, data, selectedElements]
  );

  const removeFromGroupHandler = useCallback(async () => {
    console.log({ id: data.id, groupId });
    const response = await removeFromGroup("data", { id: data.id, groupId });
  }, [data.id, groupId, removeFromGroup]);

  return (
    <Rnd
      id={`D-${riskAssessmentId}-${data.id}`}
      key={`D-${riskAssessmentId}-${data.id}`}
      disableDragging={data.disable}
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
      minWidth={expanded ? 270 : 150}
      minHeight={expanded ? 170 : 150}
      bounds="window"
      onDrag={updateXarrow}
      onResize={updateXarrow}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateSize(delta, direction, position);
      }}
      scale={scale}
      onDragStop={(e, d) => updateLocation(e, d)}
    >
      {expanded && (
        <div
          onMouseLeave={() => {
            setFirstContext("main");
            setHoveredElement(null);
          }}
          onMouseEnter={() => {
            setFirstContext("element");
            setHoveredElement(data);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            // handleContextMenu(e, data);
          }}
          // title={data.description}
          onClick={handleClick}
          className=" panningDisabled "
          style={{
            height: "100%",
            border: selectedElements.find((element) => element.id === data.id)
              ? "5px solid #62D96B"
              : !data.disable
              ? "5px solid #1D7324"
              : "5px solid grey",
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "5px",
            overflow: "scroll",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
            className="panningDisabled"
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="panningDisabled"
            >
              <Button
                className="panningDisabled"
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.id}
              </Button>
              <Button
                className="panningDisabled"
                title={data.dataObjectNew.description}
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.dataObjectNew.name}
              </Button>
              <Button
                className="panningDisabled"
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {data.dataObjectNew.chronType}
              </Button>
              <Button
                className="panningDisabled"
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
              className="panningDisabled"
            >
              <Button
                small={true}
                intent={!data.disable ? "warning" : "primary"}
                onClick={() =>
                  handleObjectAction({
                    id: data.id,
                    type: "instance",
                    operation: "enable",
                    payload: !data.disable,
                  })
                }
                className="panningDisabled"
              >
                {!data.disable ? "Disable" : "Enable"}
              </Button>
              {editGroup ? (
                <>
                  <Button
                    // fill={true}
                    // disabled={!activeAttribute}
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
                    title="Cancel"
                    intent="danger"
                    small={true}
                    icon="cross"
                    onClick={() => setEditGroup(false)}
                    loading={usingService}
                  ></Button>
                </>
              ) : (
                <Button
                  small={true}
                  onClick={handleGroup}
                  intent={!data.disable ? "success" : "none"}
                  disabled={data.disable}
                >
                  {groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
                </Button>
              )}
              {!edit ? (
                <Button
                  // fill={true}
                  disabled={data.disable}
                  title="Edit"
                  intent="warning"
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
                disabled={data.disable}
                small={true}
                intent="danger"
                onClick={() => {
                  handleObjectAction({
                    id: data.id,
                    type: "instance",
                    operation: "delete",
                    payload: "deleted",
                  });
                  setFirstContext("main");
                }}
              >
                Delete
              </Button>
            </div>
          </div>

          {data.dataObjectNew.arrayName ? (
            <table className="bp4-html-table-bordered panningDisabled">
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
                  {data.dataObjectNew.array.length} X{" "}
                  {data.dataObjectNew.array[0].length}
                </td>
              </tr>
            </table>
          ) : (
            <div style={{ paddingTop: "10px" }}>
              {edit ? (
                <TextArea
                  className="panningDisabled pinchDisabled"
                  fill={true}
                  growVertically={true}
                  onChange={(e) => setEditingValue(e.target.value)}
                  value={editingValue}
                ></TextArea>
              ) : (
                <span style={{ overflow: "auto", height: "100%" }}>
                  {viewedAttribute}
                </span>
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
      )}
    </Rnd>
  );
};
