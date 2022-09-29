import { Button } from "@blueprintjs/core";
export const EditableButton = ({
  activeAttribute,
  handleAttributeClick,
  value,
  data,
}) => {
  return (
    <Button
      fill={!value.shrink}
      title={value.title}
      small={true}
      active={activeAttribute === value.abbr}
      onClick={() => handleAttributeClick(data, value.abbr)}
      text={
        value.value && value.label
          ? `${value.title}: ${data}`
          : value.label
          ? value.abbr
          : data
      }
    />
  );
};
