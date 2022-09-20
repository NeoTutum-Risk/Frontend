import { Button } from "@blueprintjs/core";
export const EditableButton = ({
  activeAttribute,
  handleAttributeClick,
  value,
  data
}) => {
  return (
    <Button
      fill={true}
      title={value.title}
      small={true}
      active={activeAttribute === value.abbr}
      onClick={() => handleAttributeClick(data,value.abbr)}
      text={value.label?value.abbr:data}
    />
  );
};
