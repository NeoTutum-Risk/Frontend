import { ButtonGroup } from "@blueprintjs/core";
import { EditableButton } from "./editableButton";
import { EditButton } from "./editButton";

export const EditableGroup = ({
  editableValues,
  activeAttribute,
  handleAttributeClick,
  edit,
  setEdit,
  setEditingValue,
  viewedAttribute,
  resetFace,
  usingService,
  updateRiskObject,
  data
}) => {
  return (
    <ButtonGroup fill={true}>
      {editableValues.map((value) => (
        <EditableButton
          activeAttribute={activeAttribute}
          handleAttributeClick={handleAttributeClick}
          value={value}
          data={data[value.name]}
        />
      ))}
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
    </ButtonGroup>
  );
};
