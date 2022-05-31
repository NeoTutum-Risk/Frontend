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

  const [face, setFace] = useState(true);
  const [editor, setEditor] = useState(false);
  const updateXarrow = useXarrow();
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y >= 0 ? position.y : 0,
    cx: position.x >= 0 ? position.x : 0,
    offset: {},
  });


  useEffect(() => {
    setFace(!closedFace);
  }, [closedFace]);

  const updateSize = useCallback(
    async (delta,direction, position) => {
      console.log(data);
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
      const updateElementPosition = await updateRiskObjectPosition(
        riskAssessmentId,
        data.id,
        {
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: Math.round(data['position.width']+delta.width),
          height: Math.round(data['position.height']+delta.height),
          enabled: data["position.enabled"],
        }
      );
      console.log(updateElementPosition);
    },
    [riskAssessmentId, data, updateXarrow]
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


  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (e.detail !== 2) return;
      if (!data["position.enabled"]) return;
      console.log("Selecting ....");
      elementSelection(
        data,
        selectedElements.find((element) => (element.id === data.id && data.type!=="instance"))
          ? false
          : true
      );
    },
    [elementSelection, data, selectedElements]
  );

  

  return (
    <>
      <Rnd
        id={`R-${riskAssessmentId}-${data.id}`}
        key={`R-${riskAssessmentId}-${data.id}`}
        default={{
          x: drag.cx,
          y: drag.cy,
          width: data['position.width'],
          height: data['position.height'],
        }}
        minWidth={data['position.width']}
        minHeight={data['position.height']}
        bounds="window"
        onDrag={updateXarrow}
        onResize={updateXarrow}
        onResizeStop={(e, direction, ref, delta, position) => {updateSize( delta,direction, position)}}
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
