import {
  Button,
  TextArea,
  H5,
  HTMLSelect,
  FormGroup,
  FileInput,
} from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { ObjectSingleHeader } from "./miniComponents/objectSingleHeader";
export const DefaultFace = ({
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
        <ObjectSingleHeader
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
          editView={editView}
          views={views}
          viewIndex={viewIndex}
          headerValues={headerValues}
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
            // growVertically={true}
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
