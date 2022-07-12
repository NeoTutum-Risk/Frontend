import { useCallback, useState } from "react";
import { RiskElement } from "./riskElement";
import { DataObject } from "./dataObject";
import { Rnd } from "react-rnd";
import { Button } from "@blueprintjs/core";
import "./dataElement.css";
// import { Tooltip } from "./dataElementTooltip";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { updateRiskAssessmentGroup } from "../../services";
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
  setGroups
}) => {
  // console.log(`element rerendered ${data.id}`)
  // const updateXarrow = useXarrow();
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
    console.log("Drag Start");
    e.preventDefault();
    console.log(e);
    const element = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    element.setPointerCapture(e.pointerId);
    setDrag((prev) => ({ ...prev, active: true, offset: { x, y } }));
    // console.log("start drag", e.target);
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

      console.log(updateElementPosition);
    },
    [data.id, data.currentExpanded, riskAssessmentId, updateXarrow]
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
    const updateElementPosition = await updateRiskAssessmentGroup(
      data.id,
      riskAssessmentId,
      {
        x: Math.round(drag.cx),
        y: Math.round(drag.cy),
        expanded: !expanded,
      }
    );
    // setInterval(updateXarrow, 200);
    console.log(updateElementPosition);
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
      console.log("Selecting ....");
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
      // console.log("Mouse Over");
    },
    [tooltipTimer]
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
        /*expanded &&*/
        data.elements.map((object, index) =>
          object
            ? !!checkFilter(
                object.type,
                object.status,
                !object["position.enabled"]
              ) && (
                <RiskElement
                  setFirstContext={setFirstContext}
                  expanded={expanded}
                  handleContextMenu={handleContextMenu}
                  selectedElements={selectedElements}
                  elementSelection={elementSelection}
                  key={`g-r-${object.id}`}
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
                />
              )
            : null
        )
      }

      {
        /*expanded &&*/
        data.dataObjects.map((object, index) =>
          object
            ? !!checkFilter(
                object.dataObjectNew.IOtype,
                object.status,
                object.disable
              ) && (
                <DataObject
                  setFirstContext={setFirstContext}
                  expanded={expanded}
                  handleContextMenu={handleContextMenu}
                  selectedElements={selectedElements}
                  elementSelection={elementSelection}
                  key={`g-o-${object.id}`}
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
                />
              )
            : null
        )
      }

      <Rnd
        id={`group-${data.id}`}
        key={`group-${data.id}`}
        default={{
          x: drag.cx,
          y: drag.cy,
          width: 150,
          height: 150,
        }}
        minWidth={100}
        minHeight={75}
        bounds="window"
        onDrag={(e, d) => {
          console.log(e, d);
          updateXarrow();
          setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
        }}
        onDragStop={(e, d) => updateLocation(e, d)}
        onResize={updateXarrow}
        scale={scale}
      >
        <div
          onMouseLeave={() => setFirstContext("main")}
          onMouseEnter={() => setFirstContext("group")}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu(e, data);
          }}
          // title={data.description}
          onClick={handleClick}
          className="risk-object-container panningDisabled"
          style={{
            border: !expanded
              ? "5px solid rgb(56	142	142	)"
              : "5px dashed rgb(56	142	142	)",
            borderRadius: "150px",
            backgroundColor: "white",
            padding: "5px",
            textAlign: "center",
            display: "flex",
          }}
        >
          <span>{data.name}</span>
          <span>{data.id - 2000000}</span>
          {/* {!expanded &&
            data.elements.map((object, index) =>
              object
                ? object?.status !== "deleted" && (
                    <div
                      id={`R-${riskAssessmentId}-${object.id}`}
                      key={`R-${riskAssessmentId}-${object.id}`}
                    ></div>
                  )
                : null
            )}

          {!expanded &&
            data.dataObjects.map((object, index) =>
              object
                ? object?.status !== "deleted" && (
                    <div
                      id={`D-${riskAssessmentId}-${object.id}`}
                      key={`D-${riskAssessmentId}-${object.id}`}
                    ></div>
                  )
                : null
            )} */}
        </div>
      </Rnd>

      {/* {showTooltip && !drag.active && (
        <Tooltip
          x={drag.cx}
          y={drag.cy}
          tx={drag.cx}
          ty={drag.cy}
          data={{
            description: data.description,
            name: data.name,
            level_id: data.level_id,
            level_name: data.level_name,
          }}
        />
      )} */}
    </>
  );
};
