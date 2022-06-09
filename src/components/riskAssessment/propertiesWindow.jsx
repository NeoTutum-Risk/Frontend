import { Rnd } from "react-rnd";
import {
  Classes,
  Placement,
  PlacementOptions,
  Popover2,
  Popover2InteractionKind,
  Popover2SharedProps,
  StrictModifierNames,
} from "@blueprintjs/popover2";
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
import { property } from "lodash";
import { showDangerToaster, showSuccessToaster } from "../../utils/toaster";
export const PropertiesWindow = ({
  enabled,
  riskAssessmentId,
  data,
  scale,
  menu,
  handleProperties,
}) => {
  const [properties, setProperties] = useState([]);
  const [edit, setEdit] = useState(null);
  const [editedText, setEditedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getProperties = useCallback(async () => {
    const response = await getRiskObjectProperties({ ids: [data.id] });
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data);
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
      disableDragging={!enabled}
      enableResizing={enabled}
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
        <div className="panningDisabled">
          <Popover2
            fill={false}
            content={<Menu>{menu}</Menu>}
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
            />
          </Popover2>
        </div>
        <div
          className="panningDisabled"
          style={{ height: "100%", padding: "2px", overflowY: "scroll" }}
        >
          <table
            className="panningDisabled"
            style={{
              width: "100%",
              border: "solid 1px grey",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>MD2</th>
                <th>DOE</th>
                <th>Level</th>
                <th>Value</th>
                <th>Text</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr>
                  <td>{property.metaDataLevel2Name}</td>
                  <td>{property.dataObjectElementName}</td>
                  <td>{property.level_value}</td>
                  <td>{property.value}</td>
                  <td>
                    <span title={property.text}>
                      {`${String(property.text).substring(0, 4)}`}
                      {String(property.text).length > 5 ? "..." : ""}
                    </span>
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
                                  label="Description"
                                  labelInfo="(required)"
                                  labelFor="newObjectDescription"
                                >
                                  <TextArea
                                    required
                                    value={editedText}
                                    fill={true}
                                    id="newObjectDescription"
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
                        <Popover2
                          popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                          boundary={"scrollParent"}
                          enforceFocus={false}
                          isOpen={
                            edit?.type === "delete" && edit?.id === property.id
                          }
                          content={
                            <div className="bp4-popover2-content">
                              <div key="text">
                                <H5>Confirm deletion</H5>
                                <span>
                                  {`Are you sure you want to delete property
                                   ${property.metaDataLevel2Name} -> ${property.dataObjectElementName}
                                  You won't be able to recover it.`}
                                </span>
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
                                    onClick={() => setEdit(null)}
                                    loading={isLoading}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    intent="danger"
                                    className="bp4-button bp4-popover2-dismiss"
                                    loading={isLoading}
                                    onClick={handleAction}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <Button
                            small={true}
                            icon="trash"
                            intent="danger"
                            title="Delete"
                            loading={isLoading}
                            onClick={() => {
                              setEdit({ type: "delete", id: property.id });
                            }}
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
