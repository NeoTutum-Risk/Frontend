import { useCallback, useState } from "react";
import { Button, TextArea, H3 } from "@blueprintjs/core";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Rnd } from "react-rnd";
import { updateNewDataObjectInstance } from "../../services";
export const DataObject = ({
  riskAssessmentId,
  data,
  scale,
  elementSelection,
  selectedElements,
  setFirstContext,
  setHoveredElement,
  handleObjectAction,
}) => {
  const updateXarrow = useXarrow();
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
  });

  const updateSize = useCallback(
    async (delta, direction, position) => {
      // console.log(data,delta,position);
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
        width: Math.round(data.width + delta.width),
        height: Math.round(data.height + delta.height),
        enabled: data["position.enabled"],
      });
    },
    [data, updateXarrow]
  );

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
  return (
    <Rnd
      id={`D-${riskAssessmentId}-${data.id}`}
      key={`D-${riskAssessmentId}-${data.id}`}
      disableDragging={data.disable}
        enableResizing={!data.disable}
      default={{
        x: drag.cx,
        y: drag.cy,
        width: data.width,
        height: data.height,
      }}
      minWidth={270}
      minHeight={170}
      bounds="window"
      onDrag={updateXarrow}
      onResize={updateXarrow}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateSize(delta, direction, position);
      }}
      scale={scale}
      onDragStop={(e, d) => updateLocation(e, d)}
    >
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
        className="risk-object-container panningDisabled "
        style={{
          border: selectedElements.find((element) => element.id === data.id)
            ? "5px solid #62D96B"
            : !data.disable ? "5px solid #1D7324" : "5px solid grey",
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "5px",
          overflow: "scroll",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="panningDisabled"
        >
          <Button className="panningDisabled" small={true} intent={!data.disable?"success":"none"}>
            {data.id}
          </Button>
          <Button className="panningDisabled" small={true}  intent={!data.disable?"success":"none"}>
            {data.dataObjectNew.name}
          </Button>
          <Button className="panningDisabled" small={true} intent={!data.disable?"success":"none"}>
            {data.dataObjectNew.chronType}
          </Button>
          <Button className="panningDisabled" small={true} intent={!data.disable?"success":"none"}>
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
          <Button
            disabled={data.disable}
            small={true}
            intent="danger"
            onClick={() =>
              handleObjectAction({
                id: data.id,
                type: "instance",
                operation: "delete",
                payload: "deleted",
              })
            }
          >
            Delete
          </Button>
        </div>
        <div className="panningDisabled">
          <span className="panningDisabled">
            {data.dataObjectNew.description}
          </span>
        </div>
        <hr width="100%" color="grey" size="1" />
        {/* <H3 style={{ textAlign: "center" }} className="panningDisabled">
          Data Object
        </H3> */}
        <table className="bp4-html-table-bordered panningDisabled">
          {data.dataObjectNew.arrayName ? (
            <>
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
            </>
          ) : (
            <tr>
              {/* <th>Text</th> */}
              <td>{data.textType}</td>
            </tr>
          )}
        </table>
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
    </Rnd>
  );
};
