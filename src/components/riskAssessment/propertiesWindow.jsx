import { Rnd } from "react-rnd";
import { Popover2 } from "@blueprintjs/popover2";
import { Button, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { getRiskObjectProperties } from "../../services";
import { useCallback, useEffect, useState } from "react";
import { property } from "lodash";
export const PropertiesWindow = ({
  enabled,
  riskAssessmentId,
  data,
  scale,
  menu,
  handleProperties,
}) => {
  const [properties, setProperties] = useState([]);

  const getProperties = useCallback(async () => {
    const response = await getRiskObjectProperties({ ids: [data.id] });
    if (response.status === 201) {
      setProperties(
        response.data.data.map((property) => ({
          metaDataLevel2Name: property.metaDataLevel2Name,
          dataObjectElementName: property.dataObjectElementName,
          level_value: property.level_value,
          value: property.value,
        }))
      );
    }
  }, [data.id]);

  useEffect(() => {
    getProperties();
  }, [getProperties]);

  return (
    <Rnd
      id={`P-${riskAssessmentId}-${data.id}`}
      key={`P-${riskAssessmentId}-${data.id}`}
      disableDragging={!enabled}
      enableResizing={enabled}
      default={{
        x: data.x,
        y: data.y,
        width: 270,
        height: 170,
      }}
      style={{ zIndex: 1000000 }}
      minWidth={270}
      minHeight={170}
      bounds="window"
      // onDrag={updateXarrow}
      // onResize={updateXarrow}
      // onResizeStop={(e, direction, ref, delta, position) => {
      //   updateSize(delta, direction, position);
      // }}
      scale={scale}
      // onDragStop={(e, d) => updateLocation(e, d)}
    >
      <div
        className="risk-object-container panningDisabled "
        style={{
          border: "5px solid orange",
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "5px",
        }}
      >
        <div>
          <Popover2
            fill={false}
            content={<Menu>{menu}</Menu>}
            placement="right"
            onClose={()=>{
                setTimeout(getProperties, 500);
                setTimeout(getProperties, 1000);
            }}
          >
            <Button
              onClick={() => handleProperties(data.id)}
              icon="share"
              text="Set"
            />
          </Popover2>
        </div>
        <div style={{height:"100%",padding:"2px",overflowY:"scroll"}}>
          <table style={{width:"100%",border:"solid 1px grey",textAlign:"left"}}>
              <thead>
            <tr>
              <th>MD2</th>
              <th>DOE</th>
              <th>Level</th>
              <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {properties.map((property) => (
              <tr>
                <td>{property.metaDataLevel2Name}</td>
                <td>{property.dataObjectElementName}</td>
                <td>{property.level_value}</td>
                <td>{property.value}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </Rnd>
  );
};
