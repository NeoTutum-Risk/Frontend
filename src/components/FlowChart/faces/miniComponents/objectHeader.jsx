import { Button, ButtonGroup } from "@blueprintjs/core";
import { IdButton } from "./idButton";
import { EditableButton } from "./editableButton";
export const ObjectHeader = ({
  data,
  editView,
  views,
  viewIndex,
  activeAttribute,
  handleAttributeClick,
  headerValues,
}) => {
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

      <ButtonGroup>
        {headerValues.map((value) => {
          if (!value.name) {
            return (
              <Button
                className="panningDisabled pinchDisabled wheelDisabled"
                small={true}
                intent={!data.disabled ? "success" : "none"}
                text={value.title}
              />
            );
          }
          if (value.editable) {
            console.log("editable", data, value,data[value.name])
            return (
              <EditableButton
                activeAttribute={activeAttribute}
                handleAttributeClick={handleAttributeClick}
                value={value}
                data={data[value.name]}
              />
            );
          } else {
            return (
              <Button
                className="panningDisabled pinchDisabled wheelDisabled"
                small={true}
                intent={!data.disable ? "success" : "none"}
              >
                {` ${value.abbr}: ${data[value.name]}`}
              </Button>
            );
          }
        })}
      </ButtonGroup>

    </div>
  );
};
