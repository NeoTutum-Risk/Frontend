import { useCallback, useState } from "react";
import {
  Button,
  TextArea,
  H5,
  HTMLSelect,
  FormGroup,
  FileInput,
} from "@blueprintjs/core";
import { MiniFace } from "./faces/miniFace";
import { FullFace } from "./faces/fullFace";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Rnd } from "react-rnd";
import { FaceWrapper } from "./faces/miniComponents/faceWrapper";
import {
  updateNewDataObjectInstance,
  updateNewDataObjectInstanceNew,
  updateDataObjectElement,
} from "../../services";
import { size } from "lodash";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { DefaultFace } from "./faces/defaultFace";
import { OpenFace } from "./faces/openFace";
import { useEffect } from "react";
export const DataObject = ({
  riskAssessmentId,
  data,
  scale,
  elementSelection,
  selectedElements,
  setFirstContext,
  setHoveredElement,
  handleObjectAction,
  expanded,
  expandPosition,
  groupId,
  removeFromGroup,
  enviroDimension,
  addToGroup,
  groups,
  handleContextMenu,
  shared,
  rootCall,
  editableValues,
  headerValues,
  globalViewIndex,
  views,
  emptySpace,
  setEmptySpace,
}) => {
  // console.log("-----------", editableValues);

  const [viewIndex, setViewIndex] = useState(globalViewIndex);

  const editView = useCallback(
    (request) => {
      if (request === "next") {
        setViewIndex((prev) => (prev === 3 ? 0 : prev + 1));
      } else {
        setViewIndex(views.findIndex((itm) => itm === request));
      }
    },
    [views]
  );

  const [importObjectFile, setImportObjectFile] = useState(null);
  const [size, setSize] = useState({ w: data.width, h: data.height });
  const [viewedAttribute, setViewedAttribute] = useState(data.description);
  const [activeAttribute, setActiveAttribute] = useState("Desc");
  const [usingService, setUsingService] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [editGrp, setEditGrp] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const updateXarrow = useXarrow();
  const handleAttributeClick = useCallback((view, active) => {
    // console.log(view, active);
    setViewedAttribute(view);
    setActiveAttribute(active);
  }, []);
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
  });

  useEffect(() => {
    setViewIndex(globalViewIndex);
  }, [globalViewIndex]);

  const updateSize = useCallback(
    async (delta, direction, position) => {
      // console.log(data,delta,position);
      const w = Math.round(size.w + delta.width);
      const h = Math.round(size.h + delta.height);
      setSize({ w, h });
      setDrag((prev) => ({ ...prev, cy: position.y, cx: position.x }));
      if (position.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        position.x = 0;
      }

      if (position.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        position.y = 0;
      }
      updateXarrow();
      const updateOjectPosition = await updateDataObjectElement(data.id, {
        x: Math.round(position.x),
        y: Math.round(position.y),
        width: w,
        height: h,
        // enabled: data["position.enabled"],
      });
      // const updateOjectPosition = await updateNewDataObjectInstance(data.id, {
      //   x: Math.round(position.x),
      //   y: Math.round(position.y),
      //   width: w,
      //   height: h,
      //   enabled: data["position.enabled"],
      // });
    },
    [data, updateXarrow, size]
  );

  const handleGroup = useCallback(async () => {
    if (groupId) {
      setEditGroup(true);
    }
  }, [groupId]);

  const resetFace = useCallback(() => {
    console.log("Reset");
    setEdit(false);
    setEditingValue(null);
  }, []);

  const updateRiskObject = useCallback(async () => {
    setUsingService(true);
    let payload = {};

    payload[editableValues.find((val) => val.abbr === activeAttribute).name] =
      editingValue;
    const response = await rootCall("edit", { id: data.id, payload });
    if (response === "Done") {
      setViewedAttribute(editingValue);
      resetFace();
    }
    setUsingService(false);
  }, [
    editingValue,
    data.id,
    resetFace,
    activeAttribute,
    editableValues,
    rootCall,
  ]);

  const updateLocation = useCallback(
    async (e, d) => {
      setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
      if (d.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        d.x = 0;
      }

      if (d.x > enviroDimension.width - 200) {
        setDrag((prev) => ({ ...prev, cx: enviroDimension.width - 200 }));
        d.x = enviroDimension.width - 200;
      }

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }

      if (d.y > enviroDimension.height - 200) {
        setDrag((prev) => ({ ...prev, cy: enviroDimension.height - 200 }));
        d.y = enviroDimension.height - 200;
      }
      updateXarrow();
      
      const updateOjectPosition = await updateDataObjectElement(data.id, {
        x: Math.round(d.x),
        y: Math.round(d.y),
        // enabled: data["position.enabled"],
      });
    },
    [data, updateXarrow, enviroDimension]
  );

  const handleClick = useCallback(
    (e) => {
      if (e.target.className !== "bp3-file-upload-input") {
        console.log(e, e.target.name);
        if (e.target.localName !== "a") e.preventDefault();
        if (e.detail !== 2) return;
        if (data.disable) return;
        console.log("Selecting ....");
        elementSelection(
          data,
          selectedElements.find(
            (element) => element.id === data.id && element.type === data.type
          )
            ? false
            : true
        );
      }
    },
    [elementSelection, data, selectedElements]
  );

  const removeFromGroupHandler = useCallback(async () => {
    console.log({ id: data.id, groupId });
    const response = await removeFromGroup("data", { id: data.id, groupId });
  }, [data.id, groupId, removeFromGroup]);

  const handleAddToGroup = useCallback(async () => {
    setUsingService(true);
    const response = await addToGroup("data", {
      ...data,
      groupId: editingValue,
    });
    setUsingService(false);
    if (response !== "done") {
    }
  }, [addToGroup, data, editingValue]);

  return (
    <Rnd
      id={`RF-D-${data.id}`}
      key={`RF-D-${data.id}`}
      enableResizing={!data.disable}
      default={{
        x: expanded ? drag.cx : expandPosition.x,
        y: expanded ? drag.cy : expandPosition.y,
        width: expanded ? (viewIndex === 0 ? 50 : size.w) : 150,
        height: expanded ? (viewIndex === 0 ? 50 : size.h) : 150,
      }}
      position={{
        x: expanded ? drag.cx : expandPosition.x,
        y: expanded ? drag.cy : expandPosition.y,
      }}
      size={{
        width: expanded ? (viewIndex === 0 ? 100 : size.w) : 150,
        height: expanded ? (viewIndex === 0 ? 50 : size.h) : 150,
      }}
      minWidth={50}
      minHeight={50}
      bounds="window"
      onDrag={updateXarrow}
      onResize={updateXarrow}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateSize(delta, direction, position);
      }}
      scale={scale}
      onDragStop={(e, d) => updateLocation(e, d)}
    >
      <FaceWrapper
        rootCall={rootCall}
        viewIndex={viewIndex}
        data={data}
        selectedElements={selectedElements}
        handleClick={handleClick}
        className="panningDisabled pinchDisabled wheelDisabled"
        colors={{ default: "#1D7324", selected: "#EE0000", disabled: "grey" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {expanded && viewIndex === 0 ? (
          <MiniFace
            id={data.id}
            rootCall={rootCall}
            handleClick={handleClick}
            intent="success"
            selectedElements={selectedElements}
            handleAttributeClick={handleAttributeClick}
            activeAttribute={activeAttribute}
            handleObjectAction={handleObjectAction}
            shared={shared}
            groupId={groupId}
            setFirstContext={setFirstContext}
            editGroup={editGroup}
            removeFromGroupHandler={removeFromGroupHandler}
            usingService={usingService}
            setEditGroup={setEditGroup}
            editGrp={editGrp}
            setEditGrp={setEditGrp}
            setEditingValue={setEditingValue}
            handleAddToGroup={handleAddToGroup}
            viewedAttribute={viewedAttribute}
            edit={edit}
            setEdit={setEdit}
            updateRiskObject={updateRiskObject}
            resetFace={resetFace}
            views={views}
            viewIndex={viewIndex}
            editView={editView}
            editableValues={editableValues}
            headerValues={headerValues}
          />
        ) : null}
        {expanded && viewIndex === 1 ? (
          <DefaultFace
            rootCall={rootCall}
            handleClick={handleClick}
            selectedElements={selectedElements}
            data={data}
            handleAttributeClick={handleAttributeClick}
            activeAttribute={activeAttribute}
            handleObjectAction={handleObjectAction}
            shared={shared}
            groupId={groupId}
            setFirstContext={setFirstContext}
            editGroup={editGroup}
            removeFromGroupHandler={removeFromGroupHandler}
            usingService={usingService}
            setEditGroup={setEditGroup}
            editGrp={editGrp}
            setEditGrp={setEditGrp}
            setEditingValue={setEditingValue}
            editingValue={editingValue}
            handleAddToGroup={handleAddToGroup}
            viewedAttribute={viewedAttribute}
            edit={edit}
            setEdit={setEdit}
            updateRiskObject={updateRiskObject}
            resetFace={resetFace}
            views={views}
            viewIndex={viewIndex}
            editView={editView}
            editableValues={editableValues}
            headerValues={headerValues}
          />
        ) : null}
        {expanded && viewIndex === 2 ? (
          <OpenFace
            handleClick={handleClick}
            rootCall={rootCall}
            selectedElements={selectedElements}
            data={data}
            handleAttributeClick={handleAttributeClick}
            activeAttribute={activeAttribute}
            handleObjectAction={handleObjectAction}
            shared={shared}
            groupId={groupId}
            setFirstContext={setFirstContext}
            editGroup={editGroup}
            removeFromGroupHandler={removeFromGroupHandler}
            usingService={usingService}
            setEditGroup={setEditGroup}
            editGrp={editGrp}
            setEditGrp={setEditGrp}
            setEditingValue={setEditingValue}
            handleAddToGroup={handleAddToGroup}
            viewedAttribute={viewedAttribute}
            edit={edit}
            setEdit={setEdit}
            updateRiskObject={updateRiskObject}
            resetFace={resetFace}
            views={views}
            viewIndex={viewIndex}
            editView={editView}
            editableValues={editableValues}
            headerValues={headerValues}
          />
        ) : null}
        {expanded && viewIndex === 3 ? (
          <FullFace
            handleClick={handleClick}
            selectedElements={selectedElements}
            data={data}
            handleAttributeClick={handleAttributeClick}
            activeAttribute={activeAttribute}
            handleObjectAction={handleObjectAction}
            shared={shared}
            groupId={groupId}
            setFirstContext={setFirstContext}
            editGroup={editGroup}
            removeFromGroupHandler={removeFromGroupHandler}
            usingService={usingService}
            setEditGroup={setEditGroup}
            editGrp={editGrp}
            setEditGrp={setEditGrp}
            setEditingValue={setEditingValue}
            editingValue={editingValue}
            handleAddToGroup={handleAddToGroup}
            viewedAttribute={viewedAttribute}
            edit={edit}
            setEdit={setEdit}
            updateRiskObject={updateRiskObject}
            resetFace={resetFace}
            views={views}
            viewIndex={viewIndex}
            editView={editView}
            editableValues={editableValues}
            headerValues={headerValues}
            rootCall={rootCall}
          />
        ) : null}
      </FaceWrapper>
    </Rnd>
  );
};
