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
export const PropertiesWindow = ({
  enabled,
  riskAssessmentId,
  data,
  scale,
  menu,
  handleProperties,
  setShowProperties,
}) => {
  const [properties, setProperties] = useState([]);
  const [edit, setEdit] = useState(null);
  const [editedText, setEditedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getProperties = useCallback(async () => {
    const response = await getRiskObjectProperties({ ids: [data.id] });
    if (response.status >= 200 && response.status < 300) {
      setProperties(
        response.data.data.map((property) => ({
          id: property.id,
          metaDataLevel2Name: property.metaDataLevel2Name,
          dataObjectElementName: property.dataObjectElementName,
          level_value: property.level_value,
          value: property.value,
          text: property.text,
        }))
      );
    }
  }, [data.id]);
  const updateXarrow = useXarrow();
  useEffect(() => {
    getProperties();
  }, [getProperties]);

  const handleAction = useCallback(async () => {
    try {
      let response;
      setIsLoading(true);
      if (edit.type === "edit") {
        response = await updateProperty(edit.id, { text: editedText });
      } else if (edit.type === "delete") {
        response = await deleteProperty(edit.id);
      }
      if (response.status >= 200 && response.status < 300) {
        showSuccessToaster(`${edit.type} #${edit.id} is done successfully`);
        getProperties();
        setEdit(null);
        setEditedText(null);
        setIsLoading(false);
      }
    } catch (e) {
      showDangerToaster(`Faild ${edit.type} #${edit.id}`);
      setIsLoading(false);
    }
  }, [edit, editedText, getProperties]);

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
          <Popover2
            usePortal={false}
            boundary
            style={{ zIndex: 99999999999 }}
            disabled={!enabled}
            fill={false}
            content={
              <div>
                <Menu>{menu}</Menu>
              </div>
            }
            placement="right"
            onClose={() => {
              setTimeout(getProperties, 500);
              setTimeout(getProperties, 1000);
            }}
          >
            <Button
              onClick={() => handleProperties(data.id)}
              icon="share"
              text="Set"
              loading={isLoading}
              disabled={!enabled}
            />
          </Popover2>
          <H5 style={{ display: "inline", paddingLeft: "15px" }}>
            RO# {data.id}
          </H5>
        </div>
        <div
          className="panningDisabled pinchDisabled wheelDisabled"
          style={{ height: "100%", padding: "2px", overflowY: "auto" }}
        >
          <table
            // className="panningDisabled pinchDisabled wheelDisabled"
            style={{
              width: "100%",
              border: "solid 1px grey",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Level</th>
                <th>Comment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr>
                  <td>{property.metaDataLevel2Name}</td>
                  <td>
                    {property.value
                      ? ` ${property.value}`
                      : property.dataObjectElementName}
                  </td>
                  <td>{property.level_value}</td>
                  <td>
                    <span title={property.text}>{property.text}</span>
                  </td>
                  <td>
                    {
                      <>
                        {/* <Button
                          onClick={() => {
                            setEdit({ type: "edit", id: property.id });
                          }}
                          icon="edit"
                          intent="primary"
                          title="Edit"
                          small={true}
                        ></Button> */}
                        <Popover2
                          usePortal={false}
                          popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                          boundary={"scrollParent"}
                          enforceFocus={false}
                          isOpen={
                            edit?.type === "edit" && edit?.id === property.id
                          }
                          content={
                            <div className="bp4-popover2-content">
                              <div key="text">
                                <H5>Edit Text</H5>
                                <span>
                                  {`${property.metaDataLevel2Name} -> ${property.dataObjectElementName}`}
                                </span>
                                <FormGroup
                                  label="Text"
                                  labelInfo="(required)"
                                  labelFor="Text"
                                >
                                  <TextArea
                                    required
                                    value={editedText}
                                    fill={true}
                                    id="Text"
                                    onChange={(event) => {
                                      setEditedText(event.target.value);
                                    }}
                                  />
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
                                      setEdit(null);
                                      setEditedText(null);
                                    }}
                                    loading={isLoading}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    intent="primary"
                                    className="bp4-button bp4-popover2-dismiss"
                                    onClick={handleAction}
                                    loading={isLoading}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <Button
                            icon="edit"
                            intent="primary"
                            title="Edit"
                            small={true}
                            onClick={() => {
                              setEdit({ type: "edit", id: property.id });
                              setEditedText(property.text);
                            }}
                            loading={isLoading}
                          ></Button>
                        </Popover2>

                        {/* <Button
                          small={true}
                          onClick={() => {
                            setEdit({ type: "delete", id: property.id });
                          }}
                          icon="trash"
                          intent="danger"
                          title="Delete"
                        ></Button> */}
                      </>
                    }
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
