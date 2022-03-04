import { useCallback, useState } from "react";
import "./dataElement.css";
import { Tooltip } from "./dataElementTooltip";
export const DataElement = ({ data, elementSelection, showContext }) => {
  const [active, setActive] = useState(false);
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y + 10,
    cx: data.x + 100 * data.level_value,
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

  const endDrag = useCallback(
    (e) => {
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
      console.log("running");
      setActive((prev) => {
        elementSelection(data, !prev);
        return !prev;
      });
    },
    [setActive, elementSelection, data]
  );

  const handleContext = useCallback(
    (e) => {
      e.preventDefault();
      showContext({
        ...data,
        y: data.y + 10,
        x: data.x + 100 * data.level_value,
      });
      console.log("cm", data);
    },
    [showContext, data]
  );

  const handleMouseOver = useCallback(
    (e) => {
      if (tooltipTimer) return;
      setTooltipTimer(
        setTimeout(() => {
          setShowTooltip(true);
        }, 1000)
      );
      console.log("Mouse Over");
    },
    [tooltipTimer]
  );

  return (
    <>
      <g
        onClick={handleClick}
        onPointerDown={startDrag}
        onPointerMove={handleDragging}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onContextMenu={handleContext}
        onMouseOver={handleMouseOver}
        className={active ? "activeCircleElement" : "circleElement"}
      >
        {/* <rect width={50} height={50} y={drag.cy-25} x={drag.cx-25} rx={10}/> */}
        {/* <circle r={25} cy={drag.cy} cx={drag.cx} /> */}
        {/* <ellipse cy={drag.cy} cx={drag.cx} rx={50} ry={25} /> */}
        <text
          x={drag.cx}
          y={drag.cy}
          textAnchor="middle"
          strokeWidth="2px"
          dy=".3em"
        >
          {data.label}
        </text>
      </g>
      {showTooltip && !drag.active && (
        <Tooltip
          x={drag.cx}
          y={drag.cy}
          tx={drag.cx + 15}
          ty={drag.cy + 15}
          data={{
            description: data.description,
            name: data.name,
            level_id: data.level_id,
            level_name: data.level_name,
          }}
        />
      )}
    </>
  );
};
