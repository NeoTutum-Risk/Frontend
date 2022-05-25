import { useCallback, useState } from "react";
import { Button, TextArea,H3 } from "@blueprintjs/core";
// import { Column, Table } from "@blueprintjs/table";
import { Rnd } from "react-rnd";
export const DataObject = ({ riskAssessmentId, data, scale }) => {
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
  });
  const updateLocation = useCallback(async (e, d) => {}, []);

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
      scale={scale}
      onDragStop={(e, d) => updateLocation(e, d)}
    >
      <div
        //onMouseLeave={() => setFirstContext("main")}
        //onMouseEnter={() => setFirstContext("element")}
        onContextMenu={(e) => {
          e.preventDefault();
          //   handleContextMenu(e, data);
        }}
        // title={data.description}
        onClick={() => {}}
        className="risk-object-container panningDisabled "
        style={{
          border: "5px solid rgb(89, 117, 209)",
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "5px",
          overflow:"scroll"
        }}
      >
        <div style={{ display: "flex",justifyContent:"space-between" }}>
          <Button small={true} intent="primary">5</Button>
          <Button small={true} intent="primary">DO5</Button>
          <Button small={true} intent="primary">Snapshot</Button>
          <Button small={true} intent="primary">Array</Button>
        </div>
        <div>
            <span>DO5 Description this is a dummy description to check the Data Object View</span>
        </div>
        <hr width="100%" color="grey" size="1"/>
        <H3 style={{textAlign:"center"}}>Data Object</H3>
        <table className="bp4-html-table-bordered">
            <tr><th>Name</th><td>Array1</td></tr>
            <tr><th>Array</th><td>V1,v2,v3,v4,v5</td></tr>
            <tr><th>Description</th><td>Array Dummy Description</td></tr>
        </table>
        <hr width="100%" color="grey" size="1"/>
        <H3 style={{textAlign:"center"}}>Refrenced Objects</H3>
        <table>
            <tr><th>Risk Assessment</th><td>RA1</td></tr>
            <tr><th>Name</th><td>Array1</td></tr>
            <tr><th>Array</th><td>V1,v2,v3,v4,v5</td></tr>
            <tr><th>Description</th><td>Array Dummy Description</td></tr>
        </table>
        <hr width="100%" color="grey" size="1"/>
        <table>
            <tr><th>Risk Assessment</th><td>RA2</td></tr>
            <tr><th>Name</th><td>Array1</td></tr>
            <tr><th>Array</th><td>V1,v2,v3,v4,v5</td></tr>
            <tr><th>Description</th><td>Array Dummy Description</td></tr>
        </table>
        <hr width="100%" color="grey" size="1"/>
        <table>
            <tr><th>Risk Assessment</th><td>RA3</td></tr>
            <tr><th>Name</th><td>Array1</td></tr>
            <tr><th>Array</th><td>V1,v2,v3,v4,v5</td></tr>
            <tr><th>Description</th><td>Array Dummy Description</td></tr>
        </table>
      </div>
    </Rnd>
  );
};
