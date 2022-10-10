import { useCallback, useState } from "react";
import { RiskElement } from "./riskElement";
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
}) => {
  // (`element rerendered ${data.id}`)
  // const updateXarrow = useXarrow();
  const [expanded, setExpanded] = useState(data.currentExpanded);
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y - 50 >= 40 ? position.y - 50 : 40,
    cx: position.x + 50 + 75 * index >= 40 ? position.x + 50 + 75 * index : 40,
    offset: {},
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState(null);

  const startDrag = useCallback((e) => {
    ("Drag Start");
    e.preventDefault();
    (e);
    const element = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    element.setPointerCapture(e.pointerId);
    setDrag((prev) => ({ ...prev, active: true, offset: { x, y } }));
    // ("start drag", e.target);
  }, []);

  const handleDragging = useCallback(
    (e) => {
      e.preventDefault();
      updateXarrow();
      if (drag.active) {
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;

        setDrag((prev) => ({
          ...prev,
          cy: prev.cy - (prev.offset.y - y),
          cx: prev.cx - (prev.offset.x - x),
        }));
      }
    },
    [drag.active, updateXarrow]
  );

  const updateLocation = useCallback(async () => {
    if(drag.cx<40){
      setDrag(prev=>({...prev,cx:40}));
    }

    if(drag.cy<40){
      setDrag(prev=>({...prev,cy:40}));
    }
    updateXarrow();
    const updateElementPosition = await updateRiskAssessmentGroup(data.id,riskAssessmentId, {
      x: Math.round(drag.cx - 50 - 75 * index),
      y: Math.round(drag.cy + 50),
      expanded: data.currentExpanded,
    });

    (updateElementPosition);
  }, [data.id, drag.cx, drag.cy, index, data.currentExpanded, riskAssessmentId,updateXarrow]);

  const updateExpanded = useCallback(async () => {
    const updateElementPosition = await updateRiskAssessmentGroup(data.id,riskAssessmentId, {
      x: Math.round(drag.cx - 50 - 75 * index),
      y: Math.round(drag.cy + 50),
      expanded: !expanded,
    });

    setExpanded((prev) => !prev);
    updateXarrow();
    setInterval(updateXarrow, 200);
    (updateElementPosition);
  }, [data.id, drag.cx, drag.cy, index, expanded, updateXarrow,riskAssessmentId]);

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
      ("Selecting ....");
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
      {data.elements.map((object, index) => (
        <RiskElement
          expanded={expanded}
          handleContextMenu={handleContextMenu}
          selectedElements={selectedElements}
          elementSelection={elementSelection}
          index={index}
          data={object}
          riskAssessmentId={riskAssessmentId}
          position={{ x: object["position.x"], y: object["position.y"] }}
          expandPosition={{ x: drag.cx, y: drag.cy }}
          groupId={data.id}
        />
      ))}
      <g
        onClick={handleClick}
        onPointerDown={startDrag}
        onPointerMove={handleDragging}
        onPointerUp={(e) => {
          endDrag(e);
          updateLocation();
        }}
        onPointerLeave={endDrag}
        onContextMenu={(e) => handleContextMenu(e, data)}
        onMouseOver={handleMouseOver}
        className={
          selectedElements.find((element) => element.id === data.id)
            ? "activeCircleElement"
            : "groupElement"
        }
        type="group"
        id={data.id}
      >
        {/* <rect width={50} height={50} y={drag.cy-25} x={drag.cx-25} rx={10}/> */}
        <circle
          strokeDasharray={expanded ? 5 : 0}
          r={40}
          cy={drag.cy}
          cx={drag.cx}
          id={`group-${data.id}`}
        />
        {/* <ellipse
          cy={drag.cy}
          cx={drag.cx}
          rx={50}
          ry={20}
        /> */}
        <text
          fill="black"
          x={drag.cx}
          y={drag.cy}
          textAnchor="middle"
          strokeWidth="2px"
          dy=".3em"
          id={`group-${data.id}`}
        >
          {data.name}
        </text>
        <text
              x={drag.cx}
              y={drag.cy-22.5}
              textAnchor="middle"
              strokeWidth="2px"
              dy=".3em"
              fill="black"
            >
              {Number(data.id-2000000)}
            </text>
      </g>

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
