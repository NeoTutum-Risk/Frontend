import { ClosedEitor } from "./closedEditor";
import { OpenFace } from "./openFace";
import { ClosedFace } from "./closedFace";
import { Rnd } from "react-rnd";
import Resizable from "react-resizable-box";
import { useCallback, useState, useEffect } from "react";
import "./dataElement.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { updateRiskObjectPosition } from "../../services";
import Draggable from "react-draggable";
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
  setFirstContext,
  groupId,
  editRiskObject,
  closedFace,
  scale,
}) => {
  // console.log(`element ${data.id}`);
  // console.log(`element rerendered ${data.id}`);
  const [face, setFace] = useState(true);
  const [editor, setEditor] = useState(false);
  const updateXarrow = useXarrow();
  const [active, setActive] = useState(false);
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y >= 0 ? position.y : 0,
    cx: position.x >= 0 ? position.x : 0,
    offset: {},
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState(null);

  useEffect(() => {
    setFace(!closedFace);
  }, [closedFace]);

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
  const updateLocation = useCallback(
    async (e, d) => {
      setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
      if (d.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        d.x = 0;
      }

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }
      updateXarrow();
      // const x = Math.round(drag.cx );
      // const y = Math.round(drag.cy);
      const updateElementPosition = await updateRiskObjectPosition(
        riskAssessmentId,
        data.id,
        {
          x: Math.round(d.x),
          y: Math.round(d.y),
          enabled: data["position.enabled"],
        }
      );
      console.log(updateElementPosition);
    },
    [riskAssessmentId, data, updateXarrow]
  );

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
      <Rnd
        id={`R-${riskAssessmentId}-${data.id}`}
        key={`R-${riskAssessmentId}-${data.id}`}
        default={{
          x: drag.cx,
          y: drag.cy,
          width: 220,
          height: 145,
        }}
        minWidth={220}
        minHeight={145}
        bounds="window"
        onDrag={updateXarrow}
        onResize={updateXarrow}
        scale={scale}
        onDragStop={(e, d) => updateLocation(e, d)}
      >
        <div
          onMouseLeave={() => setFirstContext("main")}
          onMouseEnter={() => setFirstContext("element")}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu(e, data);
          }}
          // title={data.description}
          onClick={handleClick}
          className="risk-object-container panningDisabled "
          style={{
            border: selectedElements.find((element) => element.id === data.id)
              ? "5px solid rgb(89, 199, 209)"
              : "5px solid rgb(89, 117, 209)",
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          {face && <OpenFace data={data} groupId={groupId} setFace={setFace} />}
          {!face && (
            <ClosedFace
              editRiskObject={editRiskObject}
              data={data}
              groupId={groupId}
              setFace={setFace}
              setEditor={setEditor}
            />
          )}
        </div>
      </Rnd>
      {/* <div style={{position:"relative",zIndex:"99999999",top:(drag.cx+230)}}>
      {true && <ClosedEitor />}
    </div> */}
    </>
  );
};
