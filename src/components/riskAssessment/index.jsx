import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { DraggableBox } from "./draggableBox";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RiskElement } from "./riskElement";
import { RiskGroup } from "./riskGroup";
import { useCallback, useState, Fragment } from "react";
import { objectSelectorState } from "../../store/objectSelector";
import { useRecoilState } from "recoil";
export const RiskAssessment = ({
  objects,
  groups,
  riskAssessmentId,
  handleContextMenu,
  selectedElements,
  setSelectedElements,
  connections,
  onContext,
  resetContext,
  setFirstContext,
  editRiskObject,
  closedFace,
}) => {
  // console.log("index",typeof setFirstContext);
  const [selectedObjects, setSelectedObjects] =
    useRecoilState(objectSelectorState);
    const [globalScale,setGlobalScale]=useState(1);
  const elementSelection = useCallback(
    (elementData, state) => {
      console.log(elementData, state);
      if (state) {
        console.log("selecting");
        setSelectedElements((prev) => {
          return [...new Set([...prev, elementData])];
        });
        setSelectedObjects((prev) => {
          return [...new Set([...prev, elementData])];
        });

        console.log("store", selectedObjects);
      } else {
        setSelectedElements((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
        setSelectedObjects((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
      }
    },
    [setSelectedElements, setSelectedObjects, selectedObjects]
  );
  const updateXarrow = useXarrow();
  const handleZoomPanPinch = useCallback(() => {
    updateXarrow();
    setTimeout(updateXarrow, 0);
    setTimeout(updateXarrow, 100);
    setTimeout(updateXarrow, 300);
    setTimeout(updateXarrow, 500);
    console.log("ZOOMPANPINCH");
  }, [updateXarrow]);
  return (
    // <div
    //   style={{ overflow: "auto", height: "100%", width: "100%",position:"relative" }}
    //   onScroll={updateXarrow}
    //   onContextMenu={(e) => handleContextMenu(e, { from: "main" })}
    //   onClick={resetContext}
    // >
    <Xwrapper>
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={5}
        doubleClick={{ disabled: true }}
        onZoom={updateXarrow}
        onZoomStop={e=>{handleZoomPanPinch();setGlobalScale(e.state.scale);console.log(e)}}
        onPinching={updateXarrow}
        onPinchingStop={handleZoomPanPinch}
        onPanning={updateXarrow}
        onPanningStop={handleZoomPanPinch}
        panning={{ excluded: ["panningDisabled"] }}
        pinch={{ excluded: ["pinchDisabled"] }}
      >
        {connections.map((edge) => (
          <Xarrow
            path="straight"
            curveness={0.2}
            strokeWidth={1.5}
            // headShape={"arrow"}
            // tailShape={"arrow"}
            // headSize={7}
            // tailSize={7}
            labels={{
              middle: (
                <div style={{ display: !true ? "none" : "inline" }}>
                  {edge.name}
                </div>
              ),
            }}
            start={String("R-" + riskAssessmentId + "-" + edge.sourceRef)}
            end={String("R-" + riskAssessmentId + "-" + edge.targetRef)}
            SVGcanvasStyle={{ overflow: "hidden" }}
          />
        ))}

        <TransformComponent
          wrapperStyle={{ width: "800%", height: "800%" }}
          contentStyle={{ width: "800%", height: "800%" }}
        >
          <div
            style={{
              overflow: "auto",
              height: "8000px",
              width: "8000px",
              position: "relative",
            }}
            onScroll={updateXarrow}
            onContextMenu={(e) => handleContextMenu(e, { from: "main" })}
            onClick={resetContext}
          >
            {objects.length > 0
              ? objects.map((object, index) => (
                  <RiskElement
                    setFirstContext={setFirstContext}
                    expanded={true}
                    handleContextMenu={handleContextMenu}
                    selectedElements={selectedElements}
                    elementSelection={elementSelection}
                    index={index}
                    data={object}
                    riskAssessmentId={riskAssessmentId}
                    position={{
                      x: object["position.x"],
                      y: object["position.y"],
                    }}
                    editRiskObject={editRiskObject}
                    closedFace={closedFace}
                    scale={globalScale}
                  />
                ))
              : null}

            {groups.length > 0
              ? groups.map((group, index) => (
                  <RiskGroup
                    setFirstContext={setFirstContext}
                    updateXarrow={updateXarrow}
                    handleContextMenu={handleContextMenu}
                    selectedElements={selectedElements}
                    elementSelection={elementSelection}
                    index={index}
                    data={group}
                    riskAssessmentId={riskAssessmentId}
                    position={{
                      x: group.currentX,
                      y: group.currentY,
                    }}
                    editRiskObject={editRiskObject}
                    closedFace={closedFace}
                    scale={globalScale}
                  />
                ))
              : null}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </Xwrapper>
  );
};
