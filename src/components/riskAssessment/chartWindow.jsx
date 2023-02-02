import { Rnd } from "react-rnd";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import {
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  H5,
  TextArea,
  FormGroup,
} from "@blueprintjs/core";
import {
  getRiskObjectProperties,
  deleteProperty,
  updateProperty,
} from "../../services";
import { useCallback, useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { property } from "lodash";
import { showDangerToaster, showSuccessToaster } from "../../utils/toaster";
import { CHAT } from "@blueprintjs/icons/lib/esm/generated/iconContents";
export const ChartWindow = ({
  selectedScenario,
  selectedScenarioRun,
  enabled,
  riskAssessmentId,
  data,
  scale,
  menu,
  handleProperties,
  setShowProperties,
  charts,
  chartIndex,
  setChartIndex,
  updateSelectedChart
}) => {
  const updateXarrow = useXarrow();

  const handleAction = useCallback(async () => {}, []);

  return (
    <Rnd
      id={`P-${riskAssessmentId}-${data.id}`}
      key={`P-${riskAssessmentId}-${data.id}`}
      disableDragging={false}
      enableResizing={true}
      default={{
        x: data.x,
        y: data.y,
        width: 420,
        height: 170,
      }}
      //   position={{ x: data.x, y: data.y }}
      style={{ zIndex: 1000000 }}
      minWidth={270}
      minHeight={170}
      bounds="window"
      onDrag={updateXarrow}
      onResize={updateXarrow}
      // onResizeStop={(e, direction, ref, delta, position) => {
      //   updateSize(delta, direction, position);
      // }}
      scale={scale}
      // onDragStop={(e, d) => updateLocation(e, d)}
    >
      <div
        className="risk-object-container panningDisabled pinchDisabled wheelDisabled "
        style={{
          border: "5px solid orange",
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "5px",
        }}
      >
        <div
          className="panningDisabled pinchDisabled wheelDisabled"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <H5 style={{ display: "inline", paddingLeft: "15px" }}>
            RO# {data.id}
          </H5>
        </div>
        <div
          className="panningDisabled pinchDisabled wheelDisabled"
          style={{ height: "100%", padding: "2px", overflowY: "auto" }}
        >
          <table
            className="panningDisabled pinchDisabled wheelDisabled"
            style={{
              width: "100%",
              border: "solid 1px grey",
              textAlign: "left",
            }}
          >
            <thead className="panningDisabled pinchDisabled wheelDisabled">
              <tr className="panningDisabled pinchDisabled wheelDisabled">
                <th className="panningDisabled pinchDisabled wheelDisabled">
                  ID
                </th>
                <th className="panningDisabled pinchDisabled wheelDisabled">
                  Name
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="panningDisabled pinchDisabled wheelDisabled">
              {charts.map((chart,index) => (
                <tr
                  className="panningDisabled pinchDisabled wheelDisabled"
                  style={{
                    cursor: "pointer",
                    backgroundColor: index === chartIndex ? "Highlight" : "",
                  }}
                  onClick={()=>{setChartIndex(index);updateSelectedChart(index)}}
                >
                  <td className="panningDisabled pinchDisabled wheelDisabled">
                    {chart.id}
                  </td>
                  <td className="panningDisabled pinchDisabled wheelDisabled">
                    {chart.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Rnd>
  );
};
