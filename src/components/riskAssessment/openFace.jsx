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

export const OpenFace = ({ data, groupId, setView, charts }) => {
  const [chartIndex, setChartIndex] = useState(0);
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
              onClick={() => setView("full")}
              text={`${data.type[0].toUpperCase()}: ${data.id}`}
            />
            <Button
              text={groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
            />
            {!!charts[chartIndex] &&
            <Popover2
            
              content={
                <Menu>
                  {charts.map((chart,index)=><MenuItem text={chart.name} onClick={()=>setChartIndex(index)}/>)}
                </Menu>
              }
            >
              <Button icon="share" text={charts[chartIndex].name} />
            </Popover2>}
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
