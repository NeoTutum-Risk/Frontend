import {
  Button,
  TextArea,
  H5,
  HTMLSelect,
  FormGroup,
  FileInput,
} from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { useCallback } from "react";
import { useState } from "react";
import { EditableGroup } from "./miniComponents/editableGroup";
import { IdButton } from "./miniComponents/idButton";
import { ObjectHeader } from "./miniComponents/objectHeader";
import { FaceWrapper } from "./miniComponents/faceWrapper";
export const FullFace = ({
  handleClick,
  selectedElements,
  data,
  handleAttributeClick,
  activeAttribute,
  handleObjectAction,
  shared,
  groupId,
  setFirstContext,
  editGroup,
  removeFromGroupHandler,
  usingService,
  setEditGroup,
  editGrp,
  setEditGrp,
  setEditingValue,
  handleAddToGroup,
  viewedAttribute,
  edit,
  setEdit,
  updateRiskObject,
  resetFace,
  editingValue,
  views,
  viewIndex,
  editView,
  editableValues,
  headerValues,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
        className="panningDisabled pinchDisabled wheelDisabled"
      >
        <ObjectHeader
          data={data}
          editView={editView}
          views={views}
          viewIndex={viewIndex}
          activeAttribute={activeAttribute}
          handleAttributeClick={handleAttributeClick}
          headerValues={headerValues}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "5px",
          }}
          className="panningDisabled pinchDisabled wheelDisabled"
        >
          <Button
            disabled={shared}
            small={true}
            intent={!data.disable ? "warning" : "primary"}
            onClick={() =>
              handleObjectAction({
                id: data.id,
                type: "instance",
                operation: "enable",
                payload: !data.disable,
                groupId,
              })
            }
            className="panningDisabled pinchDisabled wheelDisabled"
          >
            {!data.disable ? "Disable" : "Enable"}
          </Button>
          <Button
            disabled={shared || data.disable}
            small={true}
            className="panningDisabled pinchDisabled wheelDisabled"
            intent={data.status === "invisible" ? "primary" : "warning"}
            title={
              data.status === "invisible" ? "Make Visible" : "Make Invisible"
            }
            icon={data.status === "invisible" ? "eye-on" : "eye-off"}
            onClick={() => {
              handleObjectAction({
                id: data.id,
                type: "instance",
                operation:
                  data.status === "invisible" ? "changed" : "invisible",
                payload: data.status === "invisible" ? "changed" : "invisible",
                object: data,
                groupId,
              });
              setFirstContext("main");
            }}
          ></Button>
          {editGroup ? (
            <>
              <Button
                // fill={true}
                // disabled={!activeAttribute}
                className="panningDisabled pinchDisabled wheelDisabled"
                title={`Remove from G#${Number(groupId - 2000000)}`}
                intent="warning"
                small={true}
                icon="graph-remove"
                onClick={removeFromGroupHandler}
                loading={usingService}
              ></Button>
              <Button
                // fill={true}
                // disabled={!activeAttribute}
                className="panningDisabled pinchDisabled wheelDisabled"
                title="Cancel"
                intent="danger"
                small={true}
                icon="cross"
                onClick={() => setEditGroup(false)}
                loading={usingService}
              ></Button>
            </>
          ) : groupId ? (
            <Button
              disabled={shared || data.disable}
              small={true}
              onClick={() => {
                setEditGroup(true);
              }}
              intent={!data.disable ? "primary" : "none"}
            >
              {groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
            </Button>
          ) : (
            <Popover2
              usePortal={false}
              popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
              boundary={"scrollParent"}
              enforceFocus={false}
              isOpen={editGrp}
              content={
                <div className="bp4-popover2-content">
                  <div key="text">
                    <H5>Add To Group</H5>
                    <span></span>
                    <FormGroup
                      label="Select Group"
                      labelInfo="(required)"
                      labelFor="grp"
                    >
                      {/* <HTMLSelect
                          required
                          value={editingValue}
                          fill={true}
                          id="Text"
                          onChange={(event) => {
                            setEditingValue(event.target.value);
                          }}
                        >
                          <option selected disabled>
                            Select Group
                          </option>
                          {groups.map((grp) => (
                            <option value={grp.id}>{grp.name}</option>
                          ))}
                        </HTMLSelect> */}
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
                          setEditGrp(false);
                          setEditingValue(null);
                        }}
                        loading={usingService}
                      >
                        Cancel
                      </Button>
                      <Button
                        intent="primary"
                        className="bp4-button bp4-popover2-dismiss"
                        onClick={handleAddToGroup}
                        loading={usingService}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              }
            >
              <Button
                disabled={data.disable}
                small={true}
                onClick={() => {
                  setEditGrp(true);
                }}
                intent={!data.disable ? "primary" : "none"}
              >
                G
              </Button>
            </Popover2>
          )}
          {!edit ? (
            <Button
              // fill={true}
              className="panningDisabled pinchDisabled wheelDisabled"
              disabled={shared || data.disable}
              title="Edit"
              intent="primary"
              small={true}
              icon="edit"
              onClick={() => {
                setEdit(true);
                setEditingValue(viewedAttribute);
              }}
            ></Button>
          ) : (
            <>
              <Button
                // fill={true}
                // disabled={!activeAttribute}
                className="panningDisabled pinchDisabled wheelDisabled"
                title="Save"
                intent="success"
                small={true}
                icon="confirm"
                onClick={updateRiskObject}
                loading={usingService}
              ></Button>
              <Button
                // fill={true}
                // disabled={!activeAttribute}
                className="panningDisabled pinchDisabled wheelDisabled"
                title="Cancel"
                intent="danger"
                small={true}
                icon="cross"
                onClick={resetFace}
                loading={usingService}
              ></Button>
            </>
          )}
          <Button
            disabled={shared || data.disable}
            small={true}
            className="panningDisabled pinchDisabled wheelDisabled"
            intent={data.status === "delete" ? "warning" : "danger"}
            onClick={() => {
              handleObjectAction({
                id: data.id,
                type: "instance",
                operation: data.status === "delete" ? "changed" : "delete",
                payload: data.status === "delete" ? "changed" : "delete",
                object: data,
                groupId,
              });
              setFirstContext("main");
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="risk-object-closed-header panningDisabled">
        <EditableGroup
          editableValues={editableValues}
          activeAttribute={activeAttribute}
          handleAttributeClick={handleAttributeClick}
          edit={edit}
          setEdit={setEdit}
          setEditingValue={setEditingValue}
          viewedAttribute={viewedAttribute}
          resetFace={resetFace}
          usingService={usingService}
          updateRiskObject={updateRiskObject}
          data={data}
        />
      </div>
      <div
        className="panningDisabled pinchDisabled wheelDisabled"
        style={{ backgroundColor: "lightsteelblue", height: "100%" }}
        // onClick={() => setEditor((prev) => !prev)}
      >
        {edit ? (
          <TextArea
            className="panningDisabled pinchDisabled wheelDisabled"
            fill={true}
            growVertically={true}
            onChange={(e) => setEditingValue(e.target.value)}
            value={editingValue}
          ></TextArea>
        ) : (
          <div
            className="panningDisabled pinchDisabled wheelDisabled"
            style={{
              backgroundColor: "lightsteelblue",
              // height: "100%",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            <span
              className="panningDisabled pinchDisabled wheelDisabled"
              style={{ overflow: "auto", height: "100%" }}
            >
              {viewedAttribute}
            </span>
          </div>
        )}
      </div>
      {/* <hr width="100%" color="grey" size="1"/>
      <H3 style={{textAlign:"center"}}>Refrenced Objects</H3>
      <table>
          <tr><th>Risk Assessment</th><td>RA1</td></tr>
          <tr><th>Name</th><td>Array1</td></tr>
          <tr><th>Array</th><td>V1,v2,v3,v4,v5</td></tr>
          <tr><th>Description</th><td>Array Dummy Description</td></tr>
      </table>
      <hr width="100%" color="grey" size="1"/> */}
    </>
  );
};
