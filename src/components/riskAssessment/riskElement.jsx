import { useCallback, useState } from "react";
import "./dataElement.css";
// import { Tooltip } from "./dataElementTooltip";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { updateRiskObjectPosition } from "../../services";
export const RiskElement = ({
  data,
  elementSelection,
  handleContextMenu,
  selectedElements,
  position,
  index,
  riskAssessmentId,
}) => {
  // console.log(`element rerendered ${data.id}`)
  const updateXarrow = useXarrow();
  const [active, setActive] = useState(false);
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y - 50,
    cx: position.x + 50 + 75 * index,
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
    [drag.active]
  );
  const updateLocation = useCallback(async () => {
    const updateElementPosition = await updateRiskObjectPosition(
      riskAssessmentId,
      data.id,
      {
        x: Math.round(drag.cx - 50 - 75 * index),
        y: Math.round(drag.cy + 50),
        enabled: 1,
      }
    );
    console.log(updateElementPosition);
  }, [riskAssessmentId, data.id, drag.cx, drag.cy, index]);
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
      elementSelection(
        data,
        selectedElements.find((element) => element.id === data.id)
          ? false
          : true
      );
      // setActive((prev) => {

      //   return !prev;
      // });
    },
    [/*setActive,*/ elementSelection, data, selectedElements]
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
      <g
        onClick={handleClick}
        onPointerDown={startDrag}
        onPointerMove={handleDragging}
        onPointerUp={(e) => {
          endDrag(e);
          updateLocation();
        }}
        onPointerLeave={endDrag}
        onContextMenu={handleContextMenu}
        onMouseOver={handleMouseOver}
        className={
          selectedElements.find((element) => element.id === data.id)
            ? "activeCircleElement"
            : "circleElement"
        }
        id={data.id}
      >
        {/* <rect width={50} height={50} y={drag.cy-25} x={drag.cx-25} rx={10}/> */}
        {/* <circle r={25} cy={drag.cy} cx={drag.cx} /> */}
        {/* <ellipse cy={drag.cy} cx={drag.cx} rx={30} ry={10} /> */}
        <text
          x={drag.cx}
          y={drag.cy}
          textAnchor="middle"
          strokeWidth="2px"
          dy=".3em"
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
