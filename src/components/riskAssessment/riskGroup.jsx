import { useCallback, useState } from "react";
import { RiskElement } from "./riskElement";
import { DataObject } from "./dataObject";
import { Rnd } from "react-rnd";
import { Button, ButtonGroup } from "@blueprintjs/core";
import "./dataElement.css";
// import { Tooltip } from "./dataElementTooltip";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { updateRiskAssessmentGroup } from "../../services";
import { showDangerToaster } from "../../utils/toaster";
export const RiskGroup = ({
  data,
  elementSelection,
  handleContextMenu,
  selectedElements,
  position,
  index,
  riskAssessmentId,
  updateXarrow,
  setFirstContext,
  editRiskObject,
  closedFace,
  scale,
  setHoveredElement,
  handleObjectAction,
  menu,
  handleProperties,
  removeFromGroup,
  handleObjectProperty,
  checkFilter,
  enviroDimension,
  setGroups,
  groups,
  addToGroup,
  handleUnshareGroup,
  connectionForm,
}) => {
  // (data.id)
  // const updateXarrow = useXarrow();
  const [size, setSize] = useState({
    w: data.currentWidth,
    h: data.currentHeight,
  });
  const [expanded, setExpanded] = useState(data.currentExpanded);
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y >= 0 ? position.y : 0,
    cx: position.x >= 0 ? position.x : 0,
    offset: {},
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState(null);

  const startDrag = useCallback((e) => {
    ("Drag Start");
    e.preventDefault();
    const element = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    element.setPointerCapture(e.pointerId);
    setDrag((prev) => ({ ...prev, active: true, offset: { x, y } }));
    // ("start drag", e.target);
  }, []);

  const handleDragging = useCallback(
    (e, d) => {
      // e.preventDefault();
      // updateXarrow();
      // if (drag.active) {
      //   const bbox = e.target.getBoundingClientRect();
      //   const x = e.clientX - bbox.left;
      //   const y = e.clientY - bbox.top;
      //   setDrag((prev) => ({
      //     ...prev,
      //     cy: prev.cy - (prev.offset.y - y),
      //     cx: prev.cx - (prev.offset.x - x),
      //   }));
      // }
    },
    [drag.active, updateXarrow]
  );

  const updateLocation = useCallback(
    async (e, d) => {
      setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
      if (d.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        d.x = 0;
      }

      if (d.x > enviroDimension.width - 500) {
        setDrag((prev) => ({ ...prev, cx: enviroDimension.width - 500 }));
        d.x = enviroDimension.width - 500;
      }

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }

      if (d.y > enviroDimension.height - 500) {
        setDrag((prev) => ({ ...prev, cy: enviroDimension.height - 500 }));
        d.y = enviroDimension.height - 500;
      }
      updateXarrow();
      const updateElementPosition = await updateRiskAssessmentGroup(
        data.id,
        riskAssessmentId,
        {
          x: Math.round(d.x),
          y: Math.round(d.y),
          expanded: data.currentExpanded,
        }
      );
    },
    [data.id, data.currentExpanded, riskAssessmentId, updateXarrow,enviroDimension]
  );

  const updateExpanded = useCallback(async () => {
    setGroups((prev) =>
      prev.map((grp) =>
        grp.id === data.id
          ? {
              ...grp,
              expanded: !expanded,
              currentExpanded: !data.currentExpanded,
            }
          : grp
      )
    );
    setExpanded((prev) => !prev);

    updateXarrow();
    try {
      const updateElementPosition = await updateRiskAssessmentGroup(
        data.id,
        riskAssessmentId,
        {
          x: Math.round(drag.cx),
          y: Math.round(drag.cy),
          expanded: !expanded,
        }
      );
      if (
        updateElementPosition.status >= 200 &&
        updateElementPosition.status < 300
      ) {
      } else {
        showDangerToaster(`Faild To Update Group`);
        setGroups((prev) =>
          prev.map((grp) =>
            grp.id === data.id
              ? {
                  ...grp,
                  expanded: !expanded,
                  currentExpanded: !data.currentExpanded,
                }
              : grp
          )
        );
        setExpanded((prev) => !prev);
      }
    } catch (error) {
      showDangerToaster(`Faild To Update Group`);
      setGroups((prev) =>
        prev.map((grp) =>
          grp.id === data.id
            ? {
                ...grp,
                expanded: !expanded,
                currentExpanded: !data.currentExpanded,
              }
            : grp
        )
      );
      setExpanded((prev) => !prev);
    }

    // setInterval(updateXarrow, 200);
    // (updateElementPosition);
  }, [
    data.id,
    drag.cx,
    drag.cy,
    expanded,
    updateXarrow,
    riskAssessmentId,
    data.currentExpanded,
    setGroups,
  ]);

  const endDrag = useCallback(
    async (e) => {
      e.preventDefault();
      setDrag((prev) => ({ ...prev, active: false }));
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
      setShowTooltip(false);
    },
    [tooltipTimer]
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (e.detail !== 2) return;
      updateExpanded();
    },
    [updateExpanded]
  );

  const handleMouseOver = useCallback(
    (e) => {
      if (tooltipTimer) return;
      setTooltipTimer(
        setTimeout(() => {
          setShowTooltip(true);
        }, 1000)
      );
      // ("Mouse Over");
    },
    [tooltipTimer]
  );

  const updateSize = useCallback(
    async (delta, direction, position) => {
      // (data,delta,position);
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
      const updateOjectPosition = await updateRiskAssessmentGroup(
        data.id,
        riskAssessmentId,
        {
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: w,
          height: h,
          expanded,
        }
      );
    },
    [data, updateXarrow, size, riskAssessmentId, expanded]
  );

  const handleConnectionClick = useCallback(
    (e, target) => {
      e.preventDefault();
      if (selectedElements[0]) {
        if (selectedElements[0].id === target.id) {
          elementSelection(target, false);
          return;
        }

        if (
          (String(selectedElements[0].description).includes("input") &&
          String(target.description).includes("input")) ||
          (String(selectedElements[0].description).includes("output") &&
          String(target.description).includes("output"))
        ) {
          showDangerToaster("Input/Output Connections Only are Allowed");
          return;
        } else {
          elementSelection(
            target,
            selectedElements.find(
              (element) =>
                element.id === target.id && target.type !== "instance"
            )
              ? false
              : true
          );

          connectionForm(e, target);
        }
      } else {
        elementSelection(
          target,
          selectedElements.find(
            (element) => element.id === target.id && target.type !== "instance"
          )
            ? false
            : true
        );
      }
      // if (e.detail !== 2) return;
      // if (!data["position.enabled"]) return;
    },
    [elementSelection, selectedElements, connectionForm]
  );
  return (
    <>
      {/* {expanded &&
        data.riskObjectGroupElements.map((object) => (
          <g id={object.riskObjectId}>
            {
              <circle
                r={35}
                cy={drag.cy}
                cx={drag.cx}
                fill-opacity="0"
                stroke-opacity="0"
              />
            }
          </g>
        ))} */}
      {
        (!data.modelGroup || expanded) &&
        data.elements.map((object, index) =>
          object
            ? !!checkFilter(
                object.type,
                object.status,
                !object["position.enabled"]
              ) && (
                <RiskElement
                  addToGroup={addToGroup}
                  groups={groups}
                  setFirstContext={setFirstContext}
                  expanded={expanded}
                  handleContextMenu={handleContextMenu}
                  selectedElements={selectedElements}
                  elementSelection={elementSelection}
                  key={`g-r-${riskAssessmentId}-${object.id}`}
                  data={object}
                  riskAssessmentId={riskAssessmentId}
                  position={{
                    x: object["position.x"],
                    y: object["position.y"],
                  }}
                  expandPosition={{ x: drag.cx, y: drag.cy }}
                  groupId={data.id}
                  editRiskObject={editRiskObject}
                  closedFace={closedFace}
                  scale={scale}
                  setHoveredElement={setHoveredElement}
                  handleObjectAction={handleObjectAction}
                  menu={menu}
                  handleProperties={handleProperties}
                  removeFromGroup={removeFromGroup}
                  handleObjectProperty={handleObjectProperty}
                  enviroDimension={enviroDimension}
                  shared={data.shared && !data.mainShared}
                />
              )
            : null
        )
      }

      {
        (!data.modelGroup || expanded) &&
        data.dataObjects.map((object, index) =>
          object
            ? !!checkFilter(
                object.dataObjectNew.IOtype,
                object.status,
                object.disable
              ) && (
                <DataObject
                  addToGroup={addToGroup}
                  groups={groups}
                  setFirstContext={setFirstContext}
                  expanded={expanded}
                  handleContextMenu={handleContextMenu}
                  selectedElements={selectedElements}
                  elementSelection={elementSelection}
                  key={`g-o-${riskAssessmentId}-${object.id}`}
                  data={object}
                  riskAssessmentId={riskAssessmentId}
                  position={{
                    x: object["position.x"],
                    y: object["position.y"],
                  }}
                  expandPosition={{ x: drag.cx, y: drag.cy }}
                  groupId={data.id}
                  editRiskObject={editRiskObject}
                  closedFace={closedFace}
                  scale={scale}
                  setHoveredElement={setHoveredElement}
                  handleObjectAction={handleObjectAction}
                  removeFromGroup={removeFromGroup}
                  enviroDimension={enviroDimension}
                  shared={data.shared && !data.mainShared}
                />
              )
            : null
        )
      }

      <Rnd
        id={`group-${data.modelGroup?"M":""}${riskAssessmentId}-${data.id}`}
        key={`group-${riskAssessmentId}-${data.id}`}
        default={{
          x: drag.cx,
          y: drag.cy,
          width: size.w,
          height: size.h,
        }}
        position={{
          x: drag.cx,
          y: drag.cy,
        }}
        size={{
          width: size.w,
          height: size.h,
        }}
        minWidth={75}
        minHeight={75}
        bounds="window"
        onDrag={(e, d) => {
          updateXarrow();
          setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
        }}
        onDragStop={(e, d) => updateLocation(e, d)}
        onResize={updateXarrow}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateSize(delta, direction, position);
        }}
        scale={scale}
      >
        {data.modelGroup ? (
          <div
            onMouseLeave={() => setFirstContext("main")}
            onMouseEnter={() => setFirstContext("group")}
            onContextMenu={(e) => {
              e.preventDefault();
              handleContextMenu(e, data);
            }}
            // onClick={handleClick}
            className="risk-object-container panningDisabled"
            style={{
              border: !expanded
                ? "1px solid #173c67"
                : "1px dashed rgb(56	142	142	)",
              backgroundColor: !expanded ? "#173c67" : "white",
              color: !expanded ? "white" : "rgb(56	142	142	)",
              // borderRadius: "150px",
              padding: "1px",
              textAlign: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <Button
            onMouseEnter={() => setFirstContext("group")}
              style={{ height: "100%", backgroundColor: "#4472c4" }}
              fill={true}
              onClick={handleClick}
            >
              <small>
                <italic>{data.id - 2000000}</italic>
              </small>{" "}
              - {data.name}
            </Button>
            {!expanded &&
              data.elements.map((element) =>
                element.description.includes("output") ? (
                  <ButtonGroup
                    onMouseEnter={() => {
                      setFirstContext("element");
                      setHoveredElement(element);
                    }}
                    key={element.id}
                    style={{ height: "100%" }}
                  >
                    <Button
                      style={{
                        backgroundColor: selectedElements.find(
                          (elm) => elm.id === element.id
                        )
                          ? "red"
                          : "#b4c7e7",
                      }}
                      // fill={true}
                      icon="arrow-right"
                      onClick={(e) => handleConnectionClick(e, element)}
                      id={`R-${riskAssessmentId}-${element.id}`}
                    />
                    <Button style={{ backgroundColor: "#b4c7e7" }} fill={true}>
                      <small>
                        <italic>{element.id}</italic>
                      </small>{" "}
                      - {element.name}
                    </Button>
                  </ButtonGroup>
                ) : element.description.includes("input") ? (
                  <ButtonGroup
                    onMouseEnter={() => {
                      setFirstContext("element");
                      setHoveredElement(element);
                    }}
                    key={element.id}
                    style={{ height: "100%" }}
                  >
                    <Button style={{ backgroundColor: "#a9d18e" }} fill={true}>
                      <small>
                        <italic>{element.id}</italic>
                      </small>{" "}
                      - {element.name}
                    </Button>
                    <Button
                      style={{
                        backgroundColor: selectedElements.find(
                          (elm) => elm.id === element.id
                        )
                          ? "red"
                          : "#a9d18e",
                      }}
                      // fill={true}
                      icon="arrow-right"
                      onClick={(e) => handleConnectionClick(e, element)}
                      id={`R-${riskAssessmentId}-${element.id}`}
                    />
                  </ButtonGroup>
                ) : null
              )}
          </div>
        ) : (
          <div
            onMouseLeave={() => setFirstContext("main")}
            onMouseEnter={() => setFirstContext("group")}
            onContextMenu={(e) => {
              e.preventDefault();
              handleContextMenu(e, data);
            }}
            onClick={handleClick}
            className="risk-object-container panningDisabled"
            style={{
              border: !expanded
                ? "5px solid #173c67"
                : "5px dashed rgb(56	142	142	)",
              backgroundColor: !expanded ? "#173c67" : "white",
              color: !expanded ? "white" : "rgb(56	142	142	)",
              borderRadius: "150px",
              padding: "5px",
              textAlign: "center",
              display: "flex",
            }}
          >
            <span>{data.shared && !data.mainShared ? "S" : ""}</span>
            <span>
              <b>{data.name}</b>
            </span>
            <span>
              <b>{data.id - 2000000}</b>
            </span>
          </div>
        )}
      </Rnd>
    </>
  );
};
