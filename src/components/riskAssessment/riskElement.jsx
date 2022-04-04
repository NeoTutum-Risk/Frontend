import { Tooltip } from "./dataElementTooltip";
import hexagon from "./shapes/hexagon.svg";
import eightgon from "./shapes/eightgon.svg";
import fivegon from "./shapes/fivegon.svg";
import hexagonactive from "./shapes/hexagonactive.svg";
import eightgonactive from "./shapes/eightgonactive.svg";
import fivegonactive from "./shapes/fivegonactive.svg";
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
  expanded,
  expandPosition,
  groupId
}) => {
  // console.log(`element ${data.id}`);
  // console.log(`element rerendered ${data.id}`);
  const updateXarrow = useXarrow();
  const [active, setActive] = useState(false);
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y - 50 >= 60 ? position.y - 50 : 60,
    cx: position.x + 50 + 75 * index >= 60 ? position.x + 50 + 75 * index : 60,
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
    // console.log("new position",drag.cx, drag.cy);
    if (drag.cx < 60) {
      setDrag((prev) => ({ ...prev, cx: 60 }));
    }

    if (drag.cy < 60) {
      setDrag((prev) => ({ ...prev, cy: 60 }));
    }

    const x = Math.round(drag.cx - 50 - 75 * index);
    const y = Math.round(drag.cy + 50);
    const updateElementPosition = await updateRiskObjectPosition(
      riskAssessmentId,
      data.id,
      {
        x,
        y,
        enabled: data["position.enabled"],
      }
    );
    console.log(updateElementPosition);
  }, [riskAssessmentId, data, drag.cx, drag.cy, index]);
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
      if (!data["position.enabled"]) return;
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
        onContextMenu={(e) => handleContextMenu(e, data)}
        onMouseOver={handleMouseOver}
        className={
          selectedElements.find((element) => element.id === data.id)
            ? "activeCircleElement"
            : "circleElement"
        }
        id={`R-${riskAssessmentId}-${data.id}`}
      >
        {/* <rect width={50} height={50} y={drag.cy-25} x={drag.cx-25} rx={10}/> */}
        {!expanded && (
          <circle
            r={35}
            cy={expandPosition.y}
            cx={expandPosition.x}
            fill-opacity="0"
            stroke-opacity="0"
          />
        )}
        {expanded && (
          <>
            {data.type === "physical" ? (
              <image
                fill="#d3d3d3"
                textAnchor="middle"
                href={
                  !selectedElements.find((element) => element.id === data.id)
                    ? hexagon
                    : hexagonactive
                }
                x={drag.cx - 60}
                y={drag.cy - 60}
                height="125px"
                width="125px"
              />
            ) : data.type === "virtual" ? (
              <image
                fill="#d3d3d3"
                textAnchor="middle"
                href={
                  !selectedElements.find((element) => element.id === data.id)
                    ? eightgon
                    : eightgonactive
                }
                x={drag.cx - 60}
                y={drag.cy - 60}
                height="120px"
                width="120px"
              />
            ) : (
              <image
                fill="#d3d3d3"
                textAnchor="middle"
                href={
                  !selectedElements.find((element) => element.id === data.id)
                    ? fivegon
                    : fivegonactive
                }
                x={drag.cx - 60}
                y={drag.cy - 60}
                height="120px"
                width="120px"
              />
            )}

            {/* <ellipse
              fill-opacity={data["position.enabled"] ? "1" : ".3"}
              stroke-opacity={data["position.enabled"] ? "1" : ".3"}
              cy={drag.cy}
              cx={drag.cx}
              rx={55}
              ry={30}
            /> */}

            <text
              x={drag.cx}
              y={drag.cy}
              textAnchor="middle"
              strokeWidth="2px"
              dy=".3em"
              fill-opacity={data["position.enabled"] ? "1" : ".3"}
              stroke-opacity={data["position.enabled"] ? "1" : ".3"}
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
              fill-opacity={data["position.enabled"] ? "1" : ".3"}
              stroke-opacity={data["position.enabled"] ? "1" : ".3"}
            >
              {groupId>0?Number(groupId-2000000):null}
            </text>
            <text
              x={drag.cx}
              y={drag.cy + 28}
              textAnchor="middle"
              strokeWidth="2px"
              dy=".3em"
              fill-opacity={data["position.enabled"] ? "1" : ".3"}
              stroke-opacity={data["position.enabled"] ? "1" : ".3"}
            >
              {data.id}
            </text>
          </>
        )}
      </g>
      {showTooltip && !drag.active && (
        <Tooltip
          x={drag.cx}
          y={drag.cy}
          tx={drag.cx}
          ty={drag.cy}
          data={{
            description: data.description,
          }}
        />
      )}
    </>
  );
};
