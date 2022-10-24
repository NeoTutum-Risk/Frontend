import { Button, ButtonGroup } from "@blueprintjs/core";
import { IdButton } from "./idButton";
import { EditableButton } from "./editableButton";
import { EditButton } from "./editButton";
import { useState } from "react";
import { useEffect } from "react";
export const ObjectSingleHeader = ({
  data,
  editView,
  views,
  viewIndex,
  activeAttribute,
  handleAttributeClick,
  headerValues,
  editableValues,
  edit,
  setEdit,
  setEditingValue,
  viewedAttribute,
  resetFace,
  usingService,
  updateRiskObject,
}) => {
  const [editableIndex, setEditableIndex] = useState(0);
  useEffect(()=>{
    handleAttributeClick(
      data[editableValues[editableIndex].name],
      editableValues[editableIndex].abbr
    );
  },[editableIndex,data,editableValues,handleAttributeClick])
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between" }}
      className="panningDisabled pinchDisabled wheelDisabled"
    >
      <IdButton
        editView={editView}
        view={views[viewIndex]}
        id={data.id}
        intent={data.disabled ? "none" : "success"}
      />
      {/* <ButtonGroup fill={true}> */}

      <Button
        icon="play"
        onClick={() => {
          setEditableIndex((prev) =>
            prev === editableValues.length - 1 ? 0 : prev + 1
          )
          
          (editableIndex);
          
        }}
      />
      <EditableButton
        activeAttribute={activeAttribute}
        handleAttributeClick={handleAttributeClick}
        value={editableValues[editableIndex]}
        data={data[editableValues[editableIndex].name]}
      />
      <EditButton
        edit={edit}
        setEdit={setEdit}
        setEditingValue={setEditingValue}
        viewedAttribute={viewedAttribute}
        activeAttribute={activeAttribute}
        resetFace={resetFace}
        usingService={usingService}
        updateRiskObject={updateRiskObject}
      />
      {/* </ButtonGroup> */}
    </div>
  );
};
