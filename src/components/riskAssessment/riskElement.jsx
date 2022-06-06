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
  setHoveredElement,
  handleObjectAction,
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

  // useEffect(()=>{
  //   if(!expanded){
  //     setDrag((prev) => ({ ...prev, cy: expandPosition.y, cx: expandPosition.x }));

  //     updateXarrow();
  //   }
  // },[expanded,expandPosition,updateXarrow])

  const updateSize = useCallback(
    async (delta, direction, position) => {
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
          width: Math.round(data["position.width"] + delta.width),
          height: Math.round(data["position.height"] + delta.height),
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
        selectedElements.find(
          (element) => element.id === data.id && data.type !== "instance"
        )
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
        disableDragging={!data["position.enabled"]}
        enableResizing={data["position.enabled"]}
        default={{
          x: expanded ? drag.cx : expandPosition.x,
          y: expanded ? drag.cy : expandPosition.y,
          width: expanded ? data["position.width"] : 150,
          height: expanded ? data["position.height"] : 150,
        }}
        position={{
          x: expanded ? drag.cx : expandPosition.x,
          y: expanded ? drag.cy : expandPosition.y,
        }}
        size={{
          width: expanded ? data["position.width"] : 150,
          height: expanded ? data["position.height"] : 150,
        }}
        minWidth={expanded ? 270 : 150}
        minHeight={expanded ? 170 : 150}
        bounds="window"
        onDrag={updateXarrow}
        onResize={updateXarrow}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateSize(delta, direction, position);
        }}
        scale={scale}
        onDragStop={(e, d) => updateLocation(e, d)}
      >
        {expanded && (
          <div
            onMouseLeave={() => {
              setFirstContext("main");
              setHoveredElement(null);
            }}
            onMouseEnter={() => {
              setFirstContext("element");
              setHoveredElement(data);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setFirstContext("element");
              setHoveredElement(data);
              handleContextMenu(e, data);
            }}
            // title={data.description}
            onClick={handleClick}
            className="risk-object-container panningDisabled "
            style={{
              border: selectedElements.find((element) => element.id === data.id)
                ? "5px solid rgb(89, 199, 209)"
                : data["position.enabled"]
                ? "5px solid rgb(89, 117, 209)"
                : "5px solid grey",
              borderRadius: "15px",
              backgroundColor: "white",
              padding: "5px",
            }}
          >
            {face /*&& data['position.enabled'] */ && (
              <OpenFace data={data} groupId={groupId} setFace={setFace} />
            )}
            {!face /*&& data['position.enabled']*/ && (
              <ClosedFace
                editRiskObject={editRiskObject}
                data={data}
                groupId={groupId}
                setFace={setFace}
                setEditor={setEditor}
                handleObjectAction={handleObjectAction}
                setFirstContext={setFirstContext}
              />
            )}
            {/* {!data['position.enabled'] && } */}
          </div>
        )}
      </Rnd>
      {/* <div style={{position:"relative",zIndex:"99999999",top:(drag.cx+230)}}>
      {true && <ClosedEitor />}
    </div> */}
    </>
  );
};
