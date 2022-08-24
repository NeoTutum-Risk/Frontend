import { Button, H5, FormGroup, HTMLSelect, TextArea } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { useEffect } from "react";
import { useState, useCallback } from "react";
export const ClosedFace = ({
  data,
  groupId,
  setFace,
  setEditor,
  editRiskObject,
  handleObjectAction,
  setFirstContext,
  setShowProperties,
  handleProperties,
  removeFromGroup,
  setGroupIdState,
  handleObjectProperty,
  showProperties,
  groups,
  addToGroup,
}) => {
  const [viewedAttribute, setViewedAttribute] = useState(data.description);
  const [activeAttribute, setActiveAttribute] = useState("D");
  const [edit, setEdit] = useState(false);
  const [editGrp, setEditGrp] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [usingService, setUsingService] = useState(false);
  const [editGroup, setEditGroup] = useState(false);

  const handleAttributeClick = useCallback((view, active) => {
    console.log(view, active);
    setViewedAttribute(view);
    setActiveAttribute(active);
  }, []);

  const resetFace = useCallback(() => {
    setEdit(false);
    setEditingValue(null);
  }, []);

  const updateRiskObject = useCallback(async () => {
    setUsingService(true);
    console.log(activeAttribute);
    let payload;
    switch (activeAttribute) {
      case "S":
        payload = { statement: editingValue };
        break;
      case "I":
        payload = { impact: editingValue };
        break;
      case "RFM":
        payload = { riskFailureMode: editingValue };
        break;
      case "CFM":
        payload = { causeFailureMechanism: editingValue };
        break;
      case "D":
        payload = { description: editingValue };
        break;
      case "N":
        payload = { name: editingValue };
        break;
      default:
    }
    // console.log(data.id,payload);
    const response = await editRiskObject(data.id, payload, groupId);
    if (response === "Done") {
      setViewedAttribute(editingValue);
      resetFace();
    }
    setUsingService(false);
  }, [
    activeAttribute,
    editingValue,
    data.id,
    editRiskObject,
    groupId,
    resetFace,
  ]);

  const handleGroup = useCallback(async () => {
    if (groupId) {
      setEditGroup(true);
    }
  }, [groupId]);

  const removeFromGroupHandler = useCallback(async () => {
    console.log({ id: data.id, groupId });
    const response = await removeFromGroup("risk", { id: data.id, groupId });
    setGroupIdState(null);
  }, [data.id, groupId, removeFromGroup, setGroupIdState]);

  const handleAddToGroup = useCallback(async () => {
    setUsingService(true);
    const response = await addToGroup("risk", {
      ...data,
      groupId: editingValue,
    });
    setUsingService(false);
    if (response !== "done") {
    }
  }, [addToGroup, data, editingValue]);

  return (
    <>
      <div className="risk-object-closed-header panningDisabled">
        <Button
          small={true}
          intent={data["position.enabled"] ? "primary" : "none"}
          onClick={() => setFace((prev) => !prev)}
          className="panningDisabled"
          style={{
            backgroundColor:
              data.type === "physical"
                ? "rgb(89, 117, 209)"
                : data.type === "model"
                ? "#CD6600"
                : "#8B008B",
          }}
        >
          {`${data.type[0].toUpperCase()}: ${data.id}`}{" "}
        </Button>
        {editGroup ? (
          <>
            <Button
              // fill={true}
              disabled={!activeAttribute}
              title={`Remove from G#${Number(groupId - 2000000)}`}
              intent="warning"
              small={true}
              icon="graph-remove"
              onClick={removeFromGroupHandler}
              loading={usingService}
            ></Button>
            <Button
              // fill={true}
              disabled={!activeAttribute}
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
            disabled={!data["position.enabled"]}
            small={true}
            onClick={() => {
              setEditGroup(true);
            }}
            intent={data["position.enabled"] ? "primary" : "none"}
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
                    <HTMLSelect
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
                    </HTMLSelect>
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
                      disabled={!editingValue}
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
              disabled={!data["position.enabled"]}
              small={true}
              onClick={() => {
                setEditGrp(true);
              }}
              intent={data["position.enabled"] ? "primary" : "none"}
            >
              G
            </Button>
          </Popover2>
        )}
        <Button
          small={true}
          intent={data["position.enabled"] ? "primary" : "none"}
          active={activeAttribute === "N"}
          onClick={() => handleAttributeClick(data.name, "N")}
        >
          {data.name}
        </Button>
      </div>
      <div className="risk-object-closed-header panningDisabled">
        <Button
          small={true}
          intent={data["position.enabled"] ? "warning" : "primary"}
          onClick={() => {
            setShowProperties(false);
            handleObjectProperty({
              id: data.id,
              action: "remove",
            });
            handleObjectAction({
              id: data.id,
              type: "risk",
              operation: "enable",
              payload: !data["position.enabled"],
              groupId,
            });
          }}
          className="panningDisabled"
        >
          {data["position.enabled"] ? "Disable" : "Enable"}
        </Button>
        <Button
          disabled={!data["position.enabled"]}
          small={true}
          intent={data.status === "invisible" ? "primary" : "warning"}
          active={activeAttribute === "N"}
          title={
            data.status === "invisible" ? "Make Visible" : "Make Invisible"
          }
          icon={data.status === "invisible" ? "eye-on" : "eye-off"}
          onClick={() => {
            handleObjectAction({
              id: data.id,
              type: "risk",
              operation: data.status === "invisible" ? "changed" : "invisible",
              payload: data.status === "invisible" ? "changed" : "invisible",
              object: data,
              groupId,
            });
            setFirstContext("main");
          }}
        ></Button>
        <Button
          small={true}
          disabled={!data["position.enabled"]}
          intent={data["position.enabled"] ? "primary" : "none"}
          onClick={() => {
            handleProperties(data.id);
            setShowProperties((prev) => !prev);
            handleObjectProperty({
              id: data.id,
              action: showProperties ? "remove" : "add",
            });
          }}
        >
          Properties
        </Button>
        <Button
          disabled={!data["position.enabled"]}
          small={true}
          intent={data.status === "delete" ? "warning" : "danger"}
          active={activeAttribute === "N"}
          onClick={() => {
            handleObjectAction({
              id: data.id,
              type: "risk",
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
      <div className="risk-object-closed-header panningDisabled">
        <Button
          fill={true}
          title="Statement"
          small={true}
          active={activeAttribute === "S"}
          onClick={() => handleAttributeClick(data.statement, "S")}
        >
          S
        </Button>
        <Button
          fill={true}
          title="Impact"
          small={true}
          active={activeAttribute === "I"}
          onClick={() => handleAttributeClick(data.impact, "I")}
        >
          I
        </Button>
        <Button
          fill={true}
          title="Risk Failure Mode"
          small={true}
          active={activeAttribute === "RFM"}
          onClick={() => handleAttributeClick(data.riskFailureMode, "RFM")}
        >
          RFM
        </Button>
        <Button
          fill={true}
          title="Causal Failure Mechanism"
          small={true}
          active={activeAttribute === "CFM"}
          onClick={() =>
            handleAttributeClick(data.causeFailureMechanism, "CFM")
          }
        >
          CFM
        </Button>
        <Button
          fill={true}
          title="Description"
          small={true}
          active={activeAttribute === "D"}
          onClick={() => handleAttributeClick(data.description, "D")}
        >
          D
        </Button>
        {!edit ? (
          <Button
            fill={true}
            disabled={!data["position.enabled"]}
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
              fill={true}
              disabled={!activeAttribute}
              title="Save"
              intent="success"
              small={true}
              icon="confirm"
              onClick={updateRiskObject}
              loading={usingService}
            ></Button>
            <Button
              fill={true}
              disabled={!activeAttribute}
              title="Cancel"
              intent="danger"
              small={true}
              icon="cross"
              onClick={resetFace}
              loading={usingService}
            ></Button>
          </>
        )}
      </div>
      <div
        className="panningDisabled pinchDisabled wheelDisabled"
        style={{ backgroundColor: "lightsteelblue", height: "100%" }}
        onClick={() => setEditor((prev) => !prev)}
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
    </>
  );
};
