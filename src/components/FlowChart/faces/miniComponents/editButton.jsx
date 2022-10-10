import { Button } from "@blueprintjs/core";
export const EditButton = ({
  edit,
  setEdit,
  setEditingValue,
  viewedAttribute,
  activeAttribute,
  resetFace,
  usingService,
  updateRiskObject,
}) => {
  return (
    <>
      {!edit ? (
        <Button
          fill={true}
          // disabled={shared || !data["position.enabled"]}
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
            onClick={()=>{updateRiskObject();}}
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
    </>
  );
};
