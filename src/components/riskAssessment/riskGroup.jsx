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
  // console.log(`element rerendered ${data.id}`)
  // const updateXarrow = useXarrow();
  const [expanded, setExpanded] = useState(data.expanded);
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y - 50 >= 40 ? position.y - 50 : 40,
    cx: position.x + 50 + 75 * index >= 40 ? position.x + 50 + 75 * index : 40,
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
    const updateElementPosition = await updateRiskAssessmentGroup(data.id, {
      x: Math.round(drag.cx - 50 - 75 * index),
      y: Math.round(drag.cy + 50),
      expanded: data.expanded,
    });

    console.log(updateElementPosition);
  }, [data.id, drag.cx, drag.cy, index, data.expanded, updateXarrow]);

  const updateExpanded = useCallback(async () => {
    const updateElementPosition = await updateRiskAssessmentGroup(data.id, {
      x: Math.round(drag.cx - 50 - 75 * index),
      y: Math.round(drag.cy + 50),
      expanded: !expanded,
    });

    setExpanded((prev) => !prev);
    updateXarrow();
    setInterval(updateXarrow, 200);
    console.log(updateElementPosition);
  }, [data.id, drag.cx, drag.cy, index, expanded, updateXarrow]);

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
      // setActive((prev) => {

      //   return !prev;
      // });
    },
    [/*setActive,*/ updateExpanded]
  );

  // const handleContext = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     showContext({
  //       ...data,
  //       y: drag.cy,
  //       x: drag.cx,
  //     });
  //     // console.log("cm", data);
  //   },
  //   [showContext,drag, data]
  // );

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
