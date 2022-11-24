import { ChartType } from "ag-grid-community";
import {
  Button,
  H5,
  ButtonGroup,
  HTMLSelect,
  TextArea,
} from "@blueprintjs/core";

export const OpenFace = ({ data, groupId, setView, chart }) => {
  return (
    <>
      <div
        style={{ display: "flex", textAlign: "center" }}
        className="panningDisabled"
        title={data.description}
      >
        <div>
          <ButtonGroup>
            <Button
              onClick={() => setView("full")}
              text={`${data.type[0].toUpperCase()}: ${data.id}`}
            />
            <Button
              text={groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
            />
          </ButtonGroup>
        </div>

        <div>
          {!!chart && <img
            style={{ width: "100%", height: "auto" }}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(chart.svg)}`}
            alt="Error Rendering Chart"
          />}
        </div>
      </div>
    </>
  );
};
