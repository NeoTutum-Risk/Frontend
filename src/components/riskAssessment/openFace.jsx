import { ChartType } from "ag-grid-community";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import {
  Button,
  H5,
  ButtonGroup,
  HTMLSelect,
  TextArea,
  MenuItem,
  Menu,
} from "@blueprintjs/core";
import { useState } from "react";

export const OpenFace = ({
  data,
  groupId,
  setView,
  charts,
  chartIndex,
  setChartIndex,
  setShowChartsWindow,
  showChartsWindow,
  handleObjectProperty,
  updateSelectedChart,
  updateSelectedFace
}) => {
  return (
    <>
      {/* <div
        style={{ display: "flex", textAlign: "center" }}
        className="panningDisabled"
        title={data.description}
      > */}
      <div>
        <ButtonGroup>
          <Button
            onClick={() =>{ setShowChartsWindow(false);setView("full");updateSelectedFace(0);handleObjectProperty({
              id: data.id,
              action: "remove",
            });}}
            text={`${data.type[0].toUpperCase()}: ${data.id}`}
          />
          <Button text={groupId ? `G: ${Number(groupId - 2000000)}` : `G: `} />
          <Button
            icon="expand-all"
            onClick={() => {
              setShowChartsWindow((prev) => !prev);
              handleObjectProperty({
                id: data.id,
                action: showChartsWindow ? "remove" : "add",
              });
            }}
          />
          {!!charts[chartIndex] && (
            <Popover2
              content={
                <Menu>
                  {charts.map((chart, index) => (
                    <MenuItem
                      text={chart.name}
                      onClick={() => {setChartIndex(index);updateSelectedChart(index)}}
                    />
                  ))}
                </Menu>
              }
            >
              <Button icon="share" text={charts[chartIndex].name} />
            </Popover2>
          )}
        </ButtonGroup>
      </div>

      <div>
        {!!charts[chartIndex] && (
          <img
            style={{ width: "100%", height: "auto", marginTop: "5px" }}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              charts[chartIndex].svg
            )}`}
            alt="Error Rendering Chart"
          />
        )}
      </div>
      {/* </div> */}
    </>
  );
};
