import { useCallback, useState } from "react";
import { Button, TextArea, H3 } from "@blueprintjs/core";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Rnd } from "react-rnd";
export const DataObject = ({
  riskAssessmentId,
  data,
  scale,
  elementSelection,
  selectedElements,
  setFirstContext,
}) => {
  const updateXarrow = useXarrow();
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
  });
  const updateLocation = useCallback(async (e, d) => {}, []);

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
      default={{
        x: drag.cx,
        y: drag.cy,
        width: 220,
        height: 145,
      }}
      minWidth={220}
      minHeight={145}
      bounds="window"
      onDrag={updateXarrow}
        onResize={updateXarrow}
      scale={scale}
      onDragStop={(e, d) => updateLocation(e, d)}
    >
      <div
        onMouseLeave={() => setFirstContext("main")}
        onMouseEnter={() => setFirstContext("element")}
        onContextMenu={(e) => {
          e.preventDefault();
          //   handleContextMenu(e, data);
        }}
        // title={data.description}
        onClick={handleClick}
        className="risk-object-container panningDisabled "
        style={{
          border: selectedElements.find((element) => element.id === data.id)
            ? "5px solid #62D96B"
            : "5px solid #1D7324",
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
          <Button className="panningDisabled" small={true} intent="success">
            {data.id}
          </Button>
          <Button className="panningDisabled" small={true} intent="success">
            {data.dataObjectNew.name}
          </Button>
          <Button className="panningDisabled" small={true} intent="success">
            {data.dataObjectNew.chronType}
          </Button>
          <Button className="panningDisabled" small={true} intent="success">
            {data.dataObjectNew.IOtype}
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
